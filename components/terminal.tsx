"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { CommandHandler } from "@/lib/command-handler"
import type { TerminalLine } from "@/types/terminal"

interface TerminalProps {
  isDarkTheme: boolean
  setIsDarkTheme: (theme: boolean) => void
}

export function Terminal({ isDarkTheme, setIsDarkTheme }: TerminalProps) {
  // Remove this line: const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "🍪 Welcome to Cookie Shell! 🍪",
      timestamp: Date.now(),
    },
    {
      type: "output",
      content: 'Type "cookie help" to see available commands.',
      timestamp: Date.now(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [gameState, setGameState] = useState<any>(null)
  const [showCursor, setShowCursor] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const commandHandler = new CommandHandler()

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Focus input when clicking terminal
  useEffect(() => {
    const handleClick = () => {
      if (isActive && inputRef.current) {
        inputRef.current.focus()
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isActive])

  const handleCommand = async (input: string) => {
    if (!input.trim()) return

    // Add command to history
    const newLines = [
      ...lines,
      {
        type: "command" as const,
        content: input,
        timestamp: Date.now(),
      },
    ]

    try {
      const result = await commandHandler.execute(input, gameState, setGameState)

      if (result.type === "clear") {
        setLines([])
      } else if (result.type === "exit") {
        setLines([
          ...newLines,
          {
            type: "output",
            content: result.content,
            timestamp: Date.now(),
          },
        ])
        setIsActive(false)
      } else {
        setLines([
          ...newLines,
          {
            type: "output",
            content: result.content,
            timestamp: Date.now(),
            className: result.className,
          },
        ])
      }
    } catch (error) {
      setLines([
        ...newLines,
        {
          type: "output",
          content: "An error occurred while processing your command.",
          timestamp: Date.now(),
        },
      ])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isActive) {
      handleCommand(currentInput)
      setCurrentInput("")
    }
  }

  const renderLine = (line: TerminalLine, index: number) => {
    if (line.type === "command") {
      return (
        <div key={index} className="flex items-center mb-1">
          <span className={`${isDarkTheme ? "text-amber-300" : "text-amber-700"} font-semibold mr-2`}>
            cookie 🍪 ~ $
          </span>
          <span className={`${isDarkTheme ? "text-amber-100" : "text-amber-900"}`}>{line.content}</span>
        </div>
      )
    }

    const getThemeClassName = (originalClass: string) => {
      if (!isDarkTheme) return originalClass

      // Map light theme colors to dark theme equivalents
      const colorMap: { [key: string]: string } = {
        "text-amber-800": "text-amber-200",
        "text-orange-600": "text-orange-300",
        "text-amber-600": "text-amber-300",
        "text-green-600": "text-green-400",
        "text-purple-600": "text-purple-400",
        "text-blue-600": "text-blue-400",
        "text-red-600": "text-red-400",
      }

      return colorMap[originalClass] || originalClass
    }

    return (
      <div
        key={index}
        className={`mb-1 whitespace-pre-wrap ${getThemeClassName(line.className || (isDarkTheme ? "text-amber-200" : "text-amber-800"))}`}
        dangerouslySetInnerHTML={{ __html: line.content }}
      />
    )
  }

  return (
    <div
      className={`${
        isDarkTheme ? "bg-[#895737]" : "bg-gradient-to-br from-amber-100 to-orange-50"
      } rounded-2xl shadow-2xl border-4 ${isDarkTheme ? "border-[#693323]" : "border-amber-200"} overflow-hidden`}
    >
      <div
        className={`${
          isDarkTheme ? "bg-[#773b2ae1]" : "bg-amber-200"
        } px-4 py-2 flex items-center justify-between border-b-2 ${
          isDarkTheme ? "border-[#693323]" : "border-amber-300"
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
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              isDarkTheme
                ? "bg-[#693323] text-amber-100 hover:bg-[693323]"
                : "bg-amber-300 text-amber-800 hover:bg-amber-400"
            }`}
          >
            {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
          </button>
          <span className={`${isDarkTheme ? "text-amber-100" : "text-amber-800"} font-semibold`}>
            Cookie Shell v1.0
          </span>
        </div>
      </div>

      <div
        ref={terminalRef}
        className={`p-4 h-96 overflow-y-auto font-mono text-sm ${
          isDarkTheme ? "bg-[#773b2ae1]" : "bg-gradient-to-b from-amber-50 to-orange-50"
        }`}
        style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
      >
        {lines.map(renderLine)}

        {isActive && (
          <div className="flex items-center">
            <span className={`${isDarkTheme ? "text-amber-300" : "text-amber-700"} font-semibold mr-2`}>
              cookie 🍪 ~ $
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
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
  )
}
