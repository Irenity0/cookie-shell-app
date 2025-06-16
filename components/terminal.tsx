"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { CommandHandler } from "@/lib/command-handler";
import type { Folder, TerminalLine } from "@/types/terminal";

interface TerminalProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (theme: boolean) => void;
}

export function Terminal({ isDarkTheme, setIsDarkTheme }: TerminalProps) {
  const [currentFolder, setCurrentFolder] = useState<Folder>("root");

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "🍪 Welcome to Cookie Shell! 🍪",
 className: isDarkTheme ? "text-amber-500" : "text-amber-600", // two shades lighter than default
    },
    {
      type: "output",
      content: 'Type "cookie help" to see available commands.',
       className: isDarkTheme ? "text-amber-500" : "text-amber-600",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [gameState, setGameState] = useState<any>(null);
  const [showCursor, setShowCursor] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHandler = new CommandHandler();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const handleClick = () => {
      if (isActive && inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive]);

  const handleCommand = async (input: string) => {
    if (!input.trim()) return;

    const newLines = [
      ...lines,
      {
        type: "command" as const,
        content: input,
        timestamp: Date.now(),
      },
    ];

    try {
      const result = await commandHandler.execute(
        input,
        gameState,
        setGameState,
        setLines,
        newLines,
        currentFolder,
        setCurrentFolder
      );

      if (result.type === "clear") {
        setLines([]);
      } else if (result.type === "exit") {
        setLines([
          ...newLines,
          {
            type: "output",
            content: result.content,
          },
        ]);
        setIsActive(false);
      } else {
        setLines([
          ...newLines,
          {
            type: "output",
            content: result.content,
            className: result.className,
          },
        ]);
      }
    } catch (error) {
      setLines([
        ...newLines,
        {
          type: "output",
          content: "An error occurred while processing your command.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isActive) {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  const renderLine = (line: TerminalLine, index: number) => {
    if (line.type === "command") {
      return (
        <div key={index} className="flex items-center mb-1">
          <span
            className={`${
              isDarkTheme ? "text-amber-300" : "text-amber-700"
            } font-semibold mr-2 text-base`}
          >
            cookie 🍪 ~ {currentFolder} $
          </span>
          <span
            className={`${isDarkTheme ? "text-amber-100" : "text-amber-900"}`}
          >
            {line.content}
          </span>
        </div>
      );
    }

    const getThemeClassName = (originalClass?: string): string => {
const colorMap: { [key: string]: string } = {
  "text-amber-800": "text-amber-200",
  "text-orange-600": "text-orange-300",
  "text-amber-600": "text-amber-300",
  "text-amber-500": "text-amber-500",
  "text-green-600": "text-green-400",
  "text-purple-600": "text-purple-400",
  "text-blue-600": "text-blue-400",
  "text-lime-600": "text-lime-600",
  "text-red-600": "text-red-400",
  "text-amber-700": "text-amber-200", // strict fallback support

  // Additional mappings based on your colors
  "text-cyan-500": "text-cyan-500",     // assuming dark cyan-400 → light cyan-500
  "text-lime-400": "text-lime-600",     // darker lime in dark mode maps to lighter lime in light
  "text-red-400": "text-red-600",       // lighter red in dark maps to darker red in light
  "text-rose-400": "text-rose-700",     // lighter rose pink in dark → darker rose in light
  "text-red-700": "text-red-800",       // dark red variants
  "text-yellow-400": "text-yellow-700", // yellow mapping for warning
  "text-amber-300": "text-amber-600",   // lighter amber in dark → medium amber in light
  "text-amber-200": "text-amber-700",   // light amber → darker amber in light mode
};


  const fallback = isDarkTheme ? "text-amber-200" : "text-amber-700";
  if (!originalClass) return fallback;

  return isDarkTheme ? colorMap[originalClass] || fallback : originalClass;
};


    return (
      <div
        key={index}
          className={`mb-1 whitespace-pre-wrap ${getThemeClassName(
    line.className || (isDarkTheme ? "text-amber-200" : "text-amber-800")
  )}`}

        dangerouslySetInnerHTML={{ __html: line.content }}
      />
    );
  };

  return (
    <div
      className={`${
        isDarkTheme
          ? "bg-[#895737]"
          : "bg-gradient-to-br from-amber-100 to-orange-50"
      } rounded-2xl shadow-2xl border-4 ${
        isDarkTheme ? "border-[#593720]" : "border-amber-200"
      } overflow-hidden`}
    >
      <div
        className={`${
          isDarkTheme ? "bg-[#643e25]" : "bg-amber-200"
        } px-4 py-2 flex items-center justify-between border-b-2 ${
          isDarkTheme ? "border-[#593720]" : "border-amber-300"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`px-3 py-1 rounded-full text-2xl font-semibold transition-all duration-200 ${
              isDarkTheme
                ? "bg-[#693323] text-amber-100 hover:bg-[693323]"
                : "bg-amber-300 text-amber-800 hover:bg-amber-400"
            }`}
          >
            {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
          </button>
          <span
            className={`${
              isDarkTheme ? "text-amber-100" : "text-amber-800"
            } font-semibold`}
          >
            Cookie Shell v1.0
          </span>
        </div>
      </div>

      <div
        ref={terminalRef}
        className={`p-4 h-96 overflow-y-auto font-mono text-base ${
          isDarkTheme
            ? "bg-[#694127]"
            : "bg-gradient-to-b from-amber-50 to-orange-50"
        }`}
        style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
      >
        {lines.map(renderLine)}

        {isActive && (
          <div className="flex items-center">
            <span
              className={`${
                isDarkTheme
                  ? "text-amber-300 text-base font-cookie"
                  : "text-amber-700"
              } font-semibold mr-2 text-base font-cookie`}
            >
              cookie 🍪 ~ {currentFolder} $
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent outline-none ${
                isDarkTheme ? "text-amber-100" : "text-amber-900"
              } caret-transparent`}
              autoFocus
            />
            <span
              className={`ml-1 ${showCursor ? "opacity-100" : "opacity-0"} ${
                isDarkTheme ? "text-amber-300" : "text-amber-800"
              }`}
            >
              🍪
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
