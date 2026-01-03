import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { useAuthContext } from "./AuthContext";
import { toast } from "sonner";
const CallContext = createContext();
export const useCallContext = () => {
  return useContext(CallContext);
};
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.relay.metered.ca:80" },
  ],
};
export const CallContextProvider = ({ children }) => {
  const [callState, setCallState] = useState({
    callId: null,
    isReceivingCall: false,
    callAccepted: false,
    callEnded: false,
    callType: null,
    remoteUser: null,
  });
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  useEffect(() => {
    if (!socket) return;
    socket.on("incomingCall", async ({ callId, from, callType }) => {
      console.log("Incoming call from:", from);
      setCallState({
        callId,
        isReceivingCall: true,
        callAccepted: false,
        callEnded: false,
        callType,
        remoteUser: from,
      });
    });
    socket.on("callAccepted", async ({ callId, answer }) => {
      console.log("Call accepted, setting remote description");
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setCallState((prev) => ({ ...prev, callAccepted: true }));
        }
      } catch (error) {
        console.error("Error setting remote description:", error);
        toast.error("Failed to establish connection");
      }
    });
    socket.on("iceCandidate", async ({ candidate }) => {
      try {
        if (peerConnection.current && candidate) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });
    socket.on("callEnded", ({ reason }) => {
      handleCallEnd(reason);
    });
    socket.on("callError", ({ message }) => {
      toast.error(message);
      handleCallEnd("error");
    });
    socket.on("callRejected", () => {
      toast.error("Call was rejected");
      handleCallEnd("rejected");
    });
    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("iceCandidate");
      socket.off("callEnded");
      socket.off("callError");
      socket.off("callRejected");
    };
  }, [socket]);
  const initializePeerConnection = async () => {
    console.log("Initializing peer connection");
    peerConnection.current = new RTCPeerConnection(configuration);
    peerConnection.current.onicecandidate = ({ candidate }) => {
      if (candidate && socket && callState.remoteUser) {
        console.log("Sending ICE candidate");
        socket.emit("iceCandidate", {
          callId: callState.callId,
          candidate,
          to: callState.remoteUser,
        });
      }
    };
    peerConnection.current.ontrack = ({ streams: [stream] }) => {
      console.log("Received remote stream");
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };
    // Add local tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log("Adding local track to peer connection");
        peerConnection.current.addTrack(track, localStream);
      });
    }
  };
  const callUser = async (userId, callType) => {
    try {
      console.log("Starting call to user:", userId);
      const constraints = {
        audio: true,
        video: callType === "video",
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      await initializePeerConnection();
      // Create and set local description
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("initiateCall", {
        userToCall: userId,
        from: authUser._id,
        callType,
        offer, // Send the offer with the call initiation
      });
      setCallState({
        callId: `${authUser._id}-${userId}`,
        isReceivingCall: false,
        callAccepted: false,
        callEnded: false,
        callType,
        remoteUser: userId,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call");
    }
  };
  const answerCall = async () => {
    try {
      console.log("Answering call");
      const constraints = {
        audio: true,
        video: callState.callType === "video",
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      await initializePeerConnection();
      // Create and set local description (answer)
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("callAnswer", {
        callId: callState.callId,
        to: callState.remoteUser,
        answer,
      });
      setCallState((prev) => ({ ...prev, callAccepted: true }));
    } catch (error) {
      console.error("Error answering call:", error);
      toast.error("Failed to answer call");
    }
  };
  const rejectCall = () => {
    socket.emit("rejectCall", {
      callId: callState.callId,
      to: callState.remoteUser,
    });
    handleCallEnd("rejected");
  };
  const handleCallEnd = (reason) => {
    console.log("Ending call, reason:", reason);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallState({
      callId: null,
      isReceivingCall: false,
      callAccepted: false,
      callEnded: true,
      callType: null,
      remoteUser: null,
    });
    if (reason === "error") {
      toast.error("Call ended due to an error");
    } else if (reason === "user_disconnected") {
      toast.error("User disconnected");
    }
  };
  const endCall = () => {
    if (callState.remoteUser) {
      socket.emit("endCall", {
        callId: callState.callId,
        to: callState.remoteUser,
      });
    }
    handleCallEnd("ended");
  };
  return (
    <CallContext.Provider
      value={{
        callState,
        localVideoRef,
        remoteVideoRef,
        callUser,
        answerCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
