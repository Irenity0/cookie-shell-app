// One line in the terminal
export interface TerminalLine {
  type: "command" | "output";       // command: user input, output: response
  content: string;                  // message content
  className?: string;              // optional style for color or formatting
}

// What a command returns to the terminal component
export interface CommandResult {
  type: "output" | "clear" | "exit"; // clear clears the terminal, exit shows message and locks
  content: string;                  // result message or exit notice
  className?: string;              // optional formatting class
}

// Game state (can be extended for more modes)
export interface GameState {
  isActive: boolean;               // is a game currently running?
  targetNumber: number;           // target number for guess game
  attempts: number;               // current number of guesses
  maxAttempts: number;            // max allowed attempts
}

// Terminal context folder tracking (you'll manage this in your component)
export type Folder = "cookie jar" | "evil cookie jar" | "root"; // added "root" for startup/default state
