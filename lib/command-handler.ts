import type { CommandResult, GameState, TerminalLine } from "@/types/terminal";
import { fortunes } from "@/lib/fortunes";

export class CommandHandler {
  async execute(
    input: string,
    gameState: GameState | null,
    setGameState: (state: GameState | null) => void,
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
    lines: TerminalLine[],
    currentFolder: string,
    setCurrentFolder: (folder: string) => void
  ): Promise<CommandResult> {
    const command = input.trim().toLowerCase();

    if (gameState?.isActive) {
      return this.handleGameInput(command, gameState, setGameState);
    }

    if (command === "cookie ls") {
      return {
        type: "output",
        content: "📂 cookie jar\n📂 evil cookie jar",
        className: "text-cyan-500",
      };
    }

    if (command.startsWith("cookie cd")) {
      const folder = command.replace("cookie cd", "").trim().toLowerCase();
      if (["cookie jar", "evil cookie jar"].includes(folder)) {
        setCurrentFolder(folder);
        return {
          type: "output",
          content: `📂 Switched to \"${folder}\"`,
          className: "text-lime-600",
        };
      } else {
        return {
          type: "output",
          content: `❌ Folder not found: \"${folder}\"`,
          className: "text-red-600",
        };
      }
    }

    if (command.startsWith("cookie")) {
      switch (command) {
        case "cookie help": return this.showHelp();
        case "cookie bake": return this.bakeCommand();
        case "cookie crumble": return this.crumbleCommand();
        case "cookie eat": return this.eatCommand();
        case "cookie fortune": return this.fortuneCommand();
        case "cookie game": return this.startGame(setGameState);
        case "cookie fun" : return this.funCommand();
        case "cookie clear": return { type: "clear", content: "" };
        case "cookie exit":
          return {
            type: "exit",
            content: "🍪 Thanks for using Cookie Shell! Refresh to start again. 🍪",
          };
        default:
          return this.handleFolderCommand(command, currentFolder);
      }
    }

    return {
      type: "output",
      content: `Unknown cookie command: \"${input}\". Try 'cookie help'.`,
      className: "text-red-600",
    };
  }

  private showHelp(): CommandResult {
  const helpText = `
🍪 <strong>Cookie Shell Commands</strong> 🍪

<span class="text-amber-500 font-bold">cookie help</span>     - Show this help message
<span class="text-amber-500 font-bold">cookie bake</span>     - Bake some delicious cookies
<span class="text-amber-500 font-bold">cookie crumble</span>  - Watch cookies crumble
<span class="text-amber-500 font-bold">cookie eat</span>      - Nom nom nom!
<span class="text-amber-500 font-bold">cookie fortune</span>  - Get a fortune cookie message
<span class="text-amber-500 font-bold">cookie game</span>     - Play the cookie guessing game
<span class="text-amber-500 font-bold">cookie fun</span>      - Have fun with cookie
<span class="text-amber-500 font-bold">cookie clear</span>    - Clear the terminal
<span class="text-amber-500 font-bold">cookie exit</span>     - Exit Cookie Shell
<span class="text-amber-500 font-bold">cookie ls</span>       - List folders
<span class="text-amber-500 font-bold">cookie cd [name]</span> - Change folders

Enjoy your sweet terminal experience! 🍪✨
`;

  return {
    type: "output",
    content: helpText,
    className: "text-amber-800",
  };
}


  private async bakeCommand(): Promise<CommandResult> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      type: "output",
      content: `🔥 Baking cookies... 🔥\n⏰ Please wait...\n🍪🍪🍪 Cookies are ready! 🍪🍪🍪\n✨ Fresh from the oven! ✨`,
      className: "text-orange-600",
    };
  }

  private funCommand(): CommandResult {
  const playfulReactions: Record<string, string> = {
    bonk: "bonk",
    throw: "throw",
    hug: "hug",
    pat: "pat",
    fight: "fight",
    love: "love",
    angry: "angry",
    give: "give",
    vibe: "vibe",
    theme: "theme",
    time: "time",
    echo: "echo",
  };

  const list = Object.keys(playfulReactions)
    .map(cmd => `- ${cmd}`)
    .join("\n");

  return {
    type: "output",
    content: `🍪 <strong>Cookie Fun Commands</strong> 🍪\nHave fun with these playful reactions:\n\n${list}\n\nTry "cookie [command] [@user]" where applicable!`,
    className: "text-yellow-700",
  };
}


  private crumbleCommand(): CommandResult {
    return {
      type: "output",
      content: `💥 CRUMBLE TIME! 💥\n${"🍪".repeat(20)}\n🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ 🍪 ⬇️ \nCrumbs everywhere! Better clean up! 🧹`,
      className: "text-amber-600",
    };
  }

  private eatCommand(): CommandResult {
    return {
      type: "output",
      content: `😋 NOM NOM NOM! 😋\n🍪 *munch* *munch* *munch* 🍪\nThat was delicious! Got milk? 🥛`,
      className: "text-green-600",
    };
  }

  private fortuneCommand(): CommandResult {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    return {
      type: "output",
      content: `🥠 <strong>Fortune Cookie Says:</strong> 🥠\n\"${randomFortune}\"\n✨ Lucky numbers: ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1} ✨`,
      className: "text-purple-600",
    };
  }

  private startGame(setGameState: (state: GameState | null) => void): CommandResult {
    const targetNumber = Math.floor(Math.random() * 5) + 1;
    setGameState({ isActive: true, targetNumber, attempts: 0, maxAttempts: 3 });
    return {
      type: "output",
      content: `🎮 <strong>Cookie Guessing Game!</strong> 🎮\nI'm thinking of a number between 1 and 5.\nYou have 3 attempts to guess it!\n🍪 Enter your guess: `,
      className: "text-blue-600",
    };
  }

  private handleGameInput(input: string, gameState: GameState, setGameState: (state: GameState | null) => void): CommandResult {
    const guess = Number.parseInt(input);
    if (isNaN(guess) || guess < 1 || guess > 5) {
      return {
        type: "output",
        content: "🚫 Please enter a number between 1 and 5!",
        className: "text-red-600",
      };
    }

    const newAttempts = gameState.attempts + 1;
    if (guess === gameState.targetNumber) {
      setGameState(null);
      return {
        type: "output",
        content: `🎉 <strong>CORRECT!</strong> 🎉\nThe number was ${gameState.targetNumber}!\n🍪 You win a virtual cookie! 🍪\n✨ Congratulations! ✨`,
        className: "text-green-600",
      };
    }

    if (newAttempts >= gameState.maxAttempts) {
      setGameState(null);
      return {
        type: "output",
        content: `😞 <strong>Game Over!</strong> 😞\nThe number was ${gameState.targetNumber}.\n🔥 Your cookie burned in the oven! 🔥\nBetter luck next time!`,
        className: "text-red-600",
      };
    }

    setGameState({ ...gameState, attempts: newAttempts });
    const hint = guess < gameState.targetNumber ? "higher" : "lower";
    const remaining = gameState.maxAttempts - newAttempts;
    return {
      type: "output",
      content: `❌ Wrong! Try ${hint}.\n🍪 ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.\nEnter your next guess: `,
      className: "text-orange-600",
    };
  }

  private handleFolderCommand(command: string, folder: string): CommandResult {
    const args = command.split(" ").slice(1);
    const sub = args[0];
    const arg = args[1];

    const playfulReactions: Record<string, string> = {
      bonk: arg?.startsWith("@") ? `🔨 Cookie bonks ${arg} on the head!` : "🔨 Cookie gets bonked! Bonk!",
      throw: "🥏 Cookie has been thrown like a frisbee!",
      hug: "🤗 Cookie gives you a warm, crumbly hug.",
      pat: "🖐️ Cookie pats you gently on the head.",
      fight: "🥊 Cookie enters an epic cookie fight!",
      love: "❤️ Cookie loves you unconditionally.",
      angry: "😠 Cookie is furious. Crumbs fly everywhere!",
      give: arg?.startsWith("@") ? `🎁 Cookie gives a cookie to ${arg}.` : "🎁 Cookie gives you... another cookie.",
      vibe: "🎶 Cookie is vibing to lo-fi beats.",
      theme: "🎵 Now playing: Cookie Theme Song (crunchy remix).",
      time: `⏰ Cookie time: ${new Date().toLocaleTimeString()}`,
      echo: args.slice(1).join(" ") || "",
    };

    const hiddenCommands: Record<string, string> = {
      dance: "💃 Cookie does a dance. It's kind of adorable.",
      sing: "🎤 Cookie sings: 'I want to bake freeeeeee!'",
      burn: "🔥 Cookie burns into ashes. Why would you do this?",
      summon: "🔮 Cookie summons... the Cookie Overlord.",
      matrix: "🟩 You are now in the Cookie Matrix. 🍪🟩",
    };

    if (sub in hiddenCommands) {
      return {
        type: "output",
        content: hiddenCommands[sub],
        className: "text-fuchsia-500 italic",
      };
    }

    if (folder === "evil cookie jar") {
      if (sub === "bonk") {
        return {
          type: "output",
          content: "☠️ Evil cookie bonks... and breaks reality.",
          className: "text-rose-700",
        };
      }
      if (sub === "burn") {
        return {
          type: "output",
          content: "🔥 The evil cookie burns everything in sight.",
          className: "text-red-800",
        };
      }
    }

    if (sub in playfulReactions) {
      return {
        type: "output",
        content: playfulReactions[sub],
        className: "text-yellow-700",
      };
    }

    return {
      type: "output",
      content: `🤔 Unknown command: \"${command}\"`,
      className: "text-red-600",
    };
  }
}
