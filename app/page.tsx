"use client"
import { Terminal } from "@/components/terminal"
import { useState } from "react"

export default function CookieShell() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  return (
    <div
      className={`min-h-screen ${
        isDarkTheme ? "bg-[#895737]" : "bg-gradient-to-br from-amber-50 to-orange-100"
      } p-4 transition-all duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1
            className={`text-4xl font-bold ${
              isDarkTheme ? "text-amber-200" : "text-amber-800"
            } mb-2 transition-colors duration-300`}
          >
            🍪 Cookie Shell 🍪
          </h1>
          <p className={`${isDarkTheme ? "text-amber-300" : "text-amber-700"} transition-colors duration-300`}>
            A deliciously interactive terminal experience
          </p>
        </div>
        <Terminal isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      </div>
    </div>
  )
}
