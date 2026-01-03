import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  List,
  Quote,
  Code,
} from "lucide-react";

const STYLING_OPTIONS = [
  {
    icon: Bold,
    name: "bold",
    markdown: "**",
    shortcut: "Ctrl+B",
    keyCode: { key: "b", ctrlKey: true },
    description: "Bold Text",
  },
  {
    icon: Italic,
    name: "italic",
    markdown: "*",
    shortcut: "Ctrl+I",
    keyCode: { key: "i", ctrlKey: true },
    description: "Italic Text",
  },
  {
    icon: Underline,
    name: "underline",
    markdown: "__",
    shortcut: "Ctrl+U",
    keyCode: { key: "u", ctrlKey: true },
    description: "Underline Text",
  },
  {
    icon: Strikethrough,
    name: "strikethrough",
    markdown: "~~",
    shortcut: "Ctrl+Shift+X",
    keyCode: { key: "x", ctrlKey: true, shiftKey: true },
    description: "Strikethrough Text",
  },
  {
    icon: Code,
    name: "code",
    markdown: "`",
    shortcut: "Ctrl+E",
    keyCode: { key: "e", ctrlKey: true },
    description: "Inline Code",
  },
  {
    icon: Quote,
    name: "quote",
    markdown: "> ",
    shortcut: "Ctrl+Shift+Q",
    keyCode: { key: "q", ctrlKey: true, shiftKey: true },
    description: "Block Quote",
  },
  {
    icon: List,
    name: "list",
    markdown: "- ",
    shortcut: "Ctrl+Shift+L",
    keyCode: { key: "l", ctrlKey: true, shiftKey: true },
    description: "Bulleted List",
  },
];

const FloatingToolbar = ({ textareaRef, message, setMessage }) => {
  const [selectedText, setSelectedText] = useState("");
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef(null);

  const calculateToolbarPosition = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      setShowToolbar(false);
      return;
    }

    // Get the selected text
    const selected = message.slice(start, end);
    setSelectedText(selected);

    // Calculate cursor position
    const startPos = textarea.getBoundingClientRect();
    const caretPosition = getCaretCoordinates(textarea, start);

    setToolbarPosition({
      top: startPos.top + caretPosition.top - 50, // Adjust as needed
      left: startPos.left + caretPosition.left,
    });

    setShowToolbar(true);
  }, [message, textareaRef]);

  // Utility function to get caret coordinates
  const getCaretCoordinates = (element, position) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.style.position = "absolute";
    div.style.top = `-9999px`;
    div.style.left = `-9999px`;
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.border = "1px solid black";
    div.style.padding = "1px";
    div.style.lineHeight = window.getComputedStyle(element).lineHeight;
    div.style.width = `${element.clientWidth}px`;

    const computedStyle = window.getComputedStyle(element);
    div.style.font = computedStyle.font;
    div.style.fontSize = computedStyle.fontSize;
    div.style.fontFamily = computedStyle.fontFamily;
    div.style.letterSpacing = computedStyle.letterSpacing;

    span.textContent = element.value.substring(0, position);
    div.appendChild(span);

    const hiddenSpan = document.createElement("span");
    hiddenSpan.textContent = "|";
    div.appendChild(hiddenSpan);

    document.body.appendChild(div);

    const coordinates = {
      top: hiddenSpan.offsetTop,
      left: hiddenSpan.offsetLeft,
    };

    document.body.removeChild(div);
    return coordinates;
  };

  const applyFormatting = (markdown) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      message.slice(0, start) +
      `${markdown}${selectedText}${markdown}` +
      message.slice(end);

    setMessage(newText);

    // Reset selection and hide toolbar
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + markdown.length,
        start + markdown.length + selectedText.length
      );
      setShowToolbar(false);
    }, 0);
  };

  // Event listeners for selection
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelect = () => {
      calculateToolbarPosition();
    };

    const handleClick = () => {
      calculateToolbarPosition();
    };

    textarea.addEventListener("select", handleSelect);
    textarea.addEventListener("click", handleClick);

    // Close toolbar if clicked outside
    const handleClickOutside = (event) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target) &&
        event.target !== textareaRef.current
      ) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      textarea.removeEventListener("select", handleSelect);
      textarea.removeEventListener("click", handleClick);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calculateToolbarPosition, textareaRef]);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Only handle shortcuts if textarea is focused
      if (
        !textareaRef.current ||
        document.activeElement !== textareaRef.current
      )
        return;

      STYLING_OPTIONS.forEach((option) => {
        const { keyCode } = option;
        const matchesKey = e.key.toLowerCase() === keyCode.key.toLowerCase();
        const matchesCtrl = keyCode.ctrlKey === e.ctrlKey;
        const matchesShift =
          keyCode.shiftKey === e.shiftKey || !keyCode.shiftKey;

        if (matchesKey && matchesCtrl && matchesShift) {
          e.preventDefault();
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = message.slice(start, end);

          // If no text is selected, wrap the markdown around the cursor position
          const textToWrap = selectedText || " ";
          const newText =
            message.slice(0, start) +
            `${option.markdown}${textToWrap}${option.markdown}` +
            message.slice(end);

          setMessage(newText);

          // Position cursor inside the markdown if no text was selected
          setTimeout(() => {
            textarea.focus();
            if (!selectedText) {
              const cursorPos = start + option.markdown.length;
              textarea.setSelectionRange(cursorPos, cursorPos);
            } else {
              textarea.setSelectionRange(
                start + option.markdown.length,
                start + option.markdown.length + selectedText.length
              );
            }
          }, 0);
        }
      });
    };

    // Add the event listener to the textarea instead of document
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyboardShortcuts);
      return () =>
        textarea.removeEventListener("keydown", handleKeyboardShortcuts);
    }
  }, [message, setMessage, textareaRef]);

  if (!showToolbar) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-gray-800 rounded-lg shadow-lg flex items-center p-1"
      style={{
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
        transform: "translateY(-100%)",
      }}
    >
      {STYLING_OPTIONS.map((option) => (
        <button
          key={option.name}
          onClick={() => applyFormatting(option.markdown)}
          className="p-2 hover:bg-gray-700 rounded transition"
          title={option.description}
        >
          <option.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default FloatingToolbar;
