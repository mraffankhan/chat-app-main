import React from "react";
import { Button } from "../ui/button";
import { PhoneCall, Video } from "lucide-react";
import { toast } from "sonner";

const CallButtons = ({ isOnline, username }) => {
  const handleVoiceCall = () => {
    if (!isOnline) {
      toast.error(`${username} is offline`);
      return;
    }
    toast.info("Voice call feature coming soon!");
  };

  const handleVideoCall = () => {
    if (!isOnline) {
      toast.error(`${username} is offline`);
      return;
    }
    toast.info("Video call feature coming soon!");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleVoiceCall}
        variant="ghost"
        size="icon"
        className={`rounded-full hover:bg-gray-800 ${
          !isOnline ? "opacity-50" : ""
        }`}
        disabled={!isOnline}
        title={isOnline ? "Start voice call" : "User is offline"}
      >
        <PhoneCall className="h-4 w-4 text-blue-400" />
      </Button>
      <Button
        onClick={handleVideoCall}
        variant="ghost"
        size="icon"
        className={`rounded-full hover:bg-gray-800 ${
          !isOnline ? "opacity-50" : ""
        }`}
        disabled={!isOnline}
        title={isOnline ? "Start video call" : "User is offline"}
      >
        <Video className="h-4 w-4 text-green-400" />
      </Button>
    </div>
  );
};

export default CallButtons;
