const formatPatterns = [
  // Headers
  {
    pattern: /^# (.+)$/gm,
    transform: (match, content) =>
      `<h1 class="text-2xl font-bold mb-2">${content}</h1>`,
  },
  {
    pattern: /^## (.+)$/gm,
    transform: (match, content) =>
      `<h2 class="text-xl font-bold mb-2">${content}</h2>`,
  },
  {
    pattern: /^### (.+)$/gm,
    transform: (match, content) =>
      `<h3 class="text-lg font-bold mb-2">${content}</h3>`,
  },

  // Bold: **text** or __text__
  {
    pattern: /(\*\*|__)(?:(?!\1).)+\1/g,
    transform: (match) =>
      `<strong class="font-bold">${match.slice(2, -2)}</strong>`,
  },

  // Italic: *text* or _text_
  {
    pattern: /(\*|_)(?:(?!\1).)+\1/g,
    transform: (match) => `<em class="italic">${match.slice(1, -1)}</em>`,
  },

  // Strikethrough: ~text~ or ~~text~~
  {
    pattern: /(\~\~|\~)(?:(?!\1).)+\1/g,
    transform: (match) =>
      `<del class="line-through">${match.slice(
        match.startsWith("~~") ? 2 : 1,
        -(match.startsWith("~~") ? 2 : 1)
      )}</del>`,
  },

  // Underline: __text__
  {
    pattern: /(__)(.*?)\1/g,
    transform: (match, _, content) => `<u class="underline">${content}</u>`,
  },

  // Highlight: ==text==
  {
    pattern: /(==)(.*?)\1/g,
    transform: (match, _, content) =>
      `<mark class="bg-yellow-500/30 rounded px-1">${content}</mark>`,
  },

  // Inline Code: `text`
  {
    pattern: /(`)(.*?)\1/g,
    transform: (match, _, content) =>
      `<code class="bg-[#171f1e] rounded p-1 font-mono text-sm">${content}</code>`,
  },

  // Block Quote: > text
  {
    pattern: /^> (.+)$/gm,
    transform: (match, content) =>
      `<blockquote class="border-l-4 border-gray-500 pl-4 my-2 italic">${content}</blockquote>`,
  },

  // Lists
  {
    pattern: /^- (.+)$/gm,
    transform: (match, content) => `<li class="list-disc ml-4">${content}</li>`,
  },
  {
    pattern: /^(\d+)\. (.+)$/gm,
    transform: (match, number, content) =>
      `<li class="list-decimal ml-4">${content}</li>`,
  },

  // Superscript: ^text^
  {
    pattern: /\^(.+?)\^/g,
    transform: (match, content) => `<sup class="text-xs">${content}</sup>`,
  },

  // Subscript: ~text~
  {
    pattern: /\~(.+?)\~/g,
    transform: (match, content) => `<sub class="text-xs">${content}</sub>`,
  },

  // Custom colored text: {color:red}text{/color}
  {
    pattern: /\{color:([\w-]+)\}([^{]+)\{\/color\}/g,
    transform: (match, color, content) =>
      `<span class="text-${color}-500">${content}</span>`,
  },
];

export const formatMessage = (text) => {
  if (!text) return "";

  let formattedText = text;

  // Replace HTML special characters to prevent XSS
  formattedText = formattedText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Apply formatting patterns
  formatPatterns.forEach(({ pattern, transform }) => {
    formattedText = formattedText.replace(pattern, transform);
  });

  // Convert URLs to clickable links
  formattedText = formattedText.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
  );

  // Convert line breaks to <br> but preserve intended line breaks for lists and quotes
  formattedText = formattedText
    .replace(/\n(?!\s*(?:[1-9]\.|\-|\>))/g, "<br>")
    .replace(/<\/li>\s*<br>/g, "</li>");

  // Wrap adjacent list items in ul/ol tags
  formattedText = formattedText
    .replace(
      /(<li class="list-disc[^>]*>.*?<\/li>)+/g,
      '<ul class="my-2">$&</ul>'
    )
    .replace(
      /(<li class="list-decimal[^>]*>.*?<\/li>)+/g,
      '<ol class="my-2">$&</ol>'
    );

  return formattedText;
};
