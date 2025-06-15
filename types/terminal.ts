export interface TerminalLine {
  type: "command" | "output"
  content: string
  timestamp: number
  className?: string
}

export interface CommandResult {
  type: "output" | "clear" | "exit"
  content: string
  className?: string
}

export interface GameState {
  isActive: boolean
  targetNumber: number
  attempts: number
  maxAttempts: number
}
