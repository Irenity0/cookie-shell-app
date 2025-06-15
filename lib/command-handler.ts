import type { CommandResult, GameState } from "@/types/terminal"
import { fortunes } from "@/lib/fortunes"

export class CommandHandler {
  async execute(
    input: string,
    gameState: GameState | null,
    setGameState: (state: GameState | null) => void,
  ): Promise<CommandResult> {
    const command = input.trim().toLowerCase()

    // Handle game input
    if (gameState?.isActive) {
      return this.handleGameInput(command, gameState, setGameState)
    }

    // Handle regular commands
    switch (command) {
      case "cookie help":
        return this.showHelp()

      case "cookie bake":
        return this.bakeCommand()

      case "cookie crumble":
        return this.crumbleCommand()

      case "cookie eat":
        return this.eatCommand()

      case "cookie fortune":
        return this.fortuneCommand()

      case "cookie game":
        return this.startGame(setGameState)

      case "cookie clear":
        return { type: "clear", content: "" }

      case "cookie exit":
        return {
          type: "exit",
          content: "🍪 Thanks for using Cookie Shell! Refresh to start again. 🍪",
        }

      default:
        return {
          type: "output",
          content: `Unknown cookie command: "${input}". Try 'cookie help'.`,
          className: "text-red-600",
        }
    }
  }

  private showHelp(): CommandResult {
    const helpText = `
🍪 <strong>Cookie Shell Commands</strong> 🍪

<span class="text-amber-700">cookie help</span>     - Show this help message
<span class="text-amber-700">cookie bake</span>     - Bake some delicious cookies
<span class="text-amber-700">cookie crumble</span>  - Watch cookies crumble
<span class="text-amber-700">cookie eat</span>      - Nom nom nom!
<span class="text-amber-700">cookie fortune</span>  - Get a fortune cookie message
<span class="text-amber-700">cookie game</span>     - Play the cookie guessing game
<span class="text-amber-700">cookie clear</span>    - Clear the terminal
<span class="text-amber-700">cookie exit</span>     - Exit Cookie Shell

Enjoy your sweet terminal experience! 🍪✨`

    return {
      type: "output",
      content: helpText,
      className: "text-amber-800",
    }
  }

  private async bakeCommand(): Promise<CommandResult> {
    // Simulate baking with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      type: "output",
      content: `
🔥 Baking cookies... 🔥
⏰ Please wait...
🍪🍪🍪 Cookies are ready! 🍪🍪🍪
✨ Fresh from the oven! ✨`,
      className: "text-orange-600",
    }
  }

  private crumbleCommand(): CommandResult {
    const crumbles = "🍪".repeat(20).split("").join(" ")
    return {
      type: "output",
      content: `
💥 CRUMBLE TIME! 💥
${crumbles}
🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪
Crumbs everywhere! Better clean up! 🧹`,
      className: "text-amber-600",
    }
  }

  private eatCommand(): CommandResult {
    return {
      type: "output",
      content: `
😋 NOM NOM NOM! 😋
🍪 *munch* *munch* *munch* 🍪
That was delicious! Got milk? 🥛`,
      className: "text-green-600",
    }
  }

  private fortuneCommand(): CommandResult {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]
    return {
      type: "output",
      content: `
🥠 <strong>Fortune Cookie Says:</strong> 🥠
"${randomFortune}"
✨ Lucky numbers: ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1} ✨`,
      className: "text-purple-600",
    }
  }

  private startGame(setGameState: (state: GameState | null) => void): CommandResult {
    const targetNumber = Math.floor(Math.random() * 5) + 1
    setGameState({
      isActive: true,
      targetNumber,
      attempts: 0,
      maxAttempts: 3,
    })

    return {
      type: "output",
      content: `
🎮 <strong>Cookie Guessing Game!</strong> 🎮
I'm thinking of a number between 1 and 5.
You have 3 attempts to guess it!
🍪 Enter your guess: `,
      className: "text-blue-600",
    }
  }

  private handleGameInput(
    input: string,
    gameState: GameState,
    setGameState: (state: GameState | null) => void,
  ): CommandResult {
    const guess = Number.parseInt(input)

    if (isNaN(guess) || guess < 1 || guess > 5) {
      return {
        type: "output",
        content: "🚫 Please enter a number between 1 and 5!",
        className: "text-red-600",
      }
    }

    const newAttempts = gameState.attempts + 1

    if (guess === gameState.targetNumber) {
      setGameState(null)
      return {
        type: "output",
        content: `
🎉 <strong>CORRECT!</strong> 🎉
The number was ${gameState.targetNumber}!
🍪 You win a virtual cookie! 🍪
✨ Congratulations! ✨`,
        className: "text-green-600",
      }
    }

    if (newAttempts >= gameState.maxAttempts) {
      setGameState(null)
      return {
        type: "output",
        content: `
😞 <strong>Game Over!</strong> 😞
The number was ${gameState.targetNumber}.
🔥 Your cookie burned in the oven! 🔥
Better luck next time!`,
        className: "text-red-600",
      }
    }

    setGameState({
      ...gameState,
      attempts: newAttempts,
    })

    const hint = guess < gameState.targetNumber ? "higher" : "lower"
    const remaining = gameState.maxAttempts - newAttempts

    return {
      type: "output",
      content: `
❌ Wrong! Try ${hint}.
🍪 ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.
Enter your next guess: `,
      className: "text-orange-600",
    }
  }
}
