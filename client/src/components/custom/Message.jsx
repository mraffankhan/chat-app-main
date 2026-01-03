import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatMessage } from "@/utils/messageFormatter";
import useMessageOperations from "@/hooks/useMessageOperations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const Message = ({ message, isOwnMessage, isDianaMessage }) => {
  const [translatedText, setTranslatedText] = useState("");
  const { translateText, isTranslating } = useTranslation();
  const [showTranslation, setShowTranslation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.message);
  const { deleteMessage, updateMessage, isLoading } = useMessageOperations();
  const inputRef = useRef(null);

  const handleTranslate = async () => {
    if (!translatedText) {
      const translation = await translateText(message.message);
      if (translation) {
        setTranslatedText(translation);
      }
    }
    setShowTranslation(!showTranslation);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(message.message);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = async () => {
    if (editedText.trim() && editedText !== message.message) {
      const success = await updateMessage(message._id, editedText.trim());
      if (success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await deleteMessage(message._id);
  };

  const displayText = showTranslation ? translatedText : message.message;
  const formattedContent = formatMessage(displayText);

  // Render message status indicators
  const renderStatus = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "sent":
        return <span className="text-xs text-gray-400">✓</span>;
      case "delivered":
        return <span className="text-xs text-gray-400">✓✓</span>;
      case "seen":
        return <span className="text-xs text-blue-400">✓✓</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`max-w-[80%] p-3 rounded-lg ${
        isOwnMessage
          ? "bg-blue-500/40 self-end"
          : isDianaMessage
          ? "bg-indigo-900/40 self-start"
          : "bg-gray-800 self-start"
      }`}
    >
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSaveEdit}
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <p
            className="text-sm whitespace-pre-wrap message-content"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
                onClick={handleTranslate}
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Translating...
                  </>
                ) : showTranslation ? (
                  "Show original"
                ) : (
                  "See translation"
                )}
              </Button>

              {isOwnMessage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-1">
              {renderStatus()}
              <span className="text-xs text-gray-400">
                {format(new Date(message.createdAt), "p")}
              </span>
              {message.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
