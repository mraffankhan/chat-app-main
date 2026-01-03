import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot } from "lucide-react";

const AI_MODELS = [
  { id: "gemini", name: "Gemini", icon: "🤖" },
  { id: "gpt", name: "GPT", icon: "🧠" },
];

const AISelector = ({ currentModel, onModelSelect }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
        <Bot className="w-4 h-4" />
        <span className="text-sm">
          {AI_MODELS.find((model) => model.id === currentModel)?.name ||
            "Gemini"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AI_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelSelect(model.id)}
            className="flex items-center gap-2"
          >
            <span>{model.icon}</span>
            <span>{model.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AISelector;
