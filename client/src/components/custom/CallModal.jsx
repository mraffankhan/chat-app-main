import React from "react";
import { useCallContext } from "@/context/CallContext";
import { Button } from "../ui/button";
import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";
const CallModal = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    callEnded,
    isReceivingCall,
    answerCall,
    leaveCall,
  } = useCallContext();
  if (!isReceivingCall && !callAccepted) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded-lg w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          {/* My Video */}
          <div className="relative">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full rounded-lg"
            />
            <p className="absolute bottom-2 left-2 text-white">My Video</p>
          </div>
          {/* User's Video */}
          {callAccepted && !callEnded && (
            <div className="relative">
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full rounded-lg"
              />
              <p className="absolute bottom-2 left-2 text-white">
                User's Video
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {isReceivingCall && !callAccepted ? (
            <>
              <Button onClick={answerCall} className="bg-green-500">
                {call.callType === "video" ? (
                  <Video className="mr-2" />
                ) : (
                  <Phone className="mr-2" />
                )}
                Answer Call
              </Button>
              <Button onClick={leaveCall} className="bg-red-500">
                {call.callType === "video" ? (
                  <VideoOff className="mr-2" />
                ) : (
                  <PhoneOff className="mr-2" />
                )}
                Reject
              </Button>
            </>
          ) : (
            <Button onClick={leaveCall} className="bg-red-500">
              End Call
              <PhoneOff className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CallModal;
