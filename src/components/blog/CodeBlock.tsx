// src/components/blog/CodeBlock.tsx
import { Check, Copy } from "@lucide/astro";
import React, { useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  class?: string;
}

export function CodeBlock({ children, class: className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className.replace("language-", "") || "text";
  const code = String(children).replace(/\n$/, "");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 rounded bg-surface0 text-text opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Copy code"
        type="button"
      >
        {copied ? <Check size="16" /> : <Copy size="16" />}
      </button>

      <pre
        className={`${className} bg-mantle text-text rounded-lg p-4 overflow-x-auto`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
