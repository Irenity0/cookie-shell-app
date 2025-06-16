// ✅ At the top of command-handler.ts
import type { CommandResult, Folder, GameState, TerminalLine } from "@/types/terminal";
import { fortunes } from "./fortunes";


export class CommandHandler {
  // We don't store currentFolder here; assume external state management
  // This execute() takes currentFolder and setCurrentFolder to track folders

  async execute(
    input: string,
    gameState: GameState | null,
    setGameState: (state: GameState | null) => void,
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
    lines: TerminalLine[],
    currentFolder: string,
    setCurrentFolder: React.Dispatch<React.SetStateAction<Folder>>
  ): Promise<CommandResult> {
    const command = input.trim();

    // If a game is active, delegate to game handler (not shown here)
    if (gameState?.isActive) {
      // Implement your game input handling here if needed
      return { type: "output", content: "Game mode active. Game commands not implemented yet." };
    }

    // Folder listing
    if (/^cookie\s+ls$/i.test(command)) {
      return {
        type: "output",
        content: "📂 cookie jar\n📂 evil cookie jar",
        className: "text-cyan-500",
      };
    }

    // Folder switching: cookie cd [folder]
    if (/^cookie\s+cd\s+(.+)$/i.test(command)) {
      const folderMatch = command.match(/^cookie\s+cd\s+(.+)$/i);
      if (folderMatch) {
        const folder = folderMatch[1].toLowerCase();
        if (folder === "cookie jar" || folder === "evil cookie jar") {
          setCurrentFolder(folder);
          return {
            type: "output",
            content: `📂 Switched to folder: "${folder}"`,
            className: "text-lime-600",
          };
        } else {
          return {
            type: "output",
            content: `❌ Folder not found: "${folder}"`,
            className: "text-red-600",
          };
        }
      }
    }

    // Main cookie commands start with "cookie"
    if (/^cookie\b/i.test(command)) {
      // Split command into words, ignoring case
      const parts = command.split(/\s+/);
      // Base command like "cookie", "cookie bake", "cookie bonk", etc.
      const baseCmd = parts.slice(0, 2).join(" ").toLowerCase();
      const args = parts.slice(2);

      // cookie help always shows folder-specific help
      if (command.toLowerCase() === "cookie help") {
        return this.showHelp(currentFolder);
      }

      // Basic commands available everywhere
      const basicCommands = ["cookie clear", "cookie exit", "cookie ls", "cookie nerd", "cookie theme"];
      if (basicCommands.includes(command.toLowerCase())) {
        return this.handleBasicCommands(command.toLowerCase());
      }

      // Folder-specific commands
      if (currentFolder === "cookie jar") {
        return this.handleCookieJarCommands(baseCmd, args);
      } else if (currentFolder === "evil cookie jar") {
        return this.handleEvilCookieJarCommands(baseCmd, args);
      } else {
        return {
          type: "output",
          content: `You are not inside any known cookie folder. Use 'cookie cd [folder]' to switch folders.`,
          className: "text-yellow-700",
        };
      }
    }

    return {
      type: "output",
      content: `Unknown command: "${input}". Try 'cookie help'.`,
      className: "text-red-600",
    };
  }

  private showHelp(currentFolder: string): CommandResult {
  const basicCommands = `
<span class="text-amber-500 font-bold">cookie clear</span>    - Clear the terminal
<span class="text-amber-500 font-bold">cookie exit</span>     - Exit Cookie Shell
<span class="text-amber-500 font-bold">cookie ls</span>       - List folders
<span class="text-amber-500 font-bold">cookie cd [name]</span> - Change folders
<span class="text-amber-500 font-bold">cookie nerd</span>     - Maybe a nerd cookie appears
<span class="text-amber-500 font-bold">cookie theme</span>    - Change the cookie theme
`;

  const cookieJarCommands = `
<span class="text-amber-500 font-bold">cookie help</span>      - Show this help message
<span class="text-amber-500 font-bold">cookie bake</span>      - Bake cookies
<span class="text-amber-500 font-bold">cookie eat</span>       - Eat cookies
<span class="text-amber-500 font-bold">cookie fortune</span>   - Get a fortune cookie
<span class="text-amber-500 font-bold">cookie fun</span>       - Fun commands: hug, pat, love, give, vibe
`;

  const evilCookieJarCommands = `
<span class="text-amber-500 font-bold">cookie help</span>         - Show this help message
<span class="text-amber-500 font-bold">cookie bonk [@user]</span>    - Bonk someone or yourself
<span class="text-amber-500 font-bold">cookie throw [@user]</span>   - Throw cookies
<span class="text-amber-500 font-bold">cookie fight [@user]</span>   - Fight with cookies
<span class="text-amber-500 font-bold">cookie angry [@user]</span>   - Show anger
<span class="text-amber-500 font-bold">cookie jealous [@user]</span> - Show jealousy
`;

  let content = `🍪 <strong>Basic Cookie Commands</strong> 🍪\n${basicCommands}\n`;

  let className = "text-amber-800"; // default for light theme

  if (currentFolder === "cookie jar") {
    content += `🍪 <strong>Cookie Jar Commands</strong> 🍪\n${cookieJarCommands}`;
    className = "text-orange-600";
  } else if (currentFolder === "evil cookie jar") {
    content += `🍪 <strong>Evil Cookie Jar Commands</strong> 🍪\n${evilCookieJarCommands}`;
    className = "text-red-600"; // important: so it maps to red-400 in dark
  } else {
    content += `📁 Use 'cookie cd [folder]' to switch folders.\n`;
  }

  return {
    type: "output",
    content,
    className,
  };
}


  private handleBasicCommands(command: string): CommandResult {
    switch (command) {
      case "cookie clear":
        return { type: "clear", content: "" };
      case "cookie exit":
        return {
          type: "exit",
          content: "🍪 Thanks for using Cookie Shell! Refresh to start again. 🍪",
        };
      case "cookie ls":
        return {
          type: "output",
          content: "📂 cookie jar\n📂 evil cookie jar",
          className: "text-amber-700",
        };
      case "cookie nerd":
        return {
          type: "output",
          content: Math.random() > 0.5
            ? "🤓 Nerd cookie appears! Time to study."
            : "No nerd cookies today, just chill!",
          className: "text-blue-600",
        };
      case "cookie theme":
        return {
          type: "output",
          content: "🎨 Cookie theme changed! (pretend it really did)",
          className: "text-purple-600",
        };
      default:
        return {
          type: "output",
          content: `Unknown basic command: "${command}"`,
          className: "text-red-600",
        };
    }
  }

  private createFunResponse(emoji: string, action: string, args: string[]): CommandResult {
  const userArg = args.find((arg) => arg.startsWith("@"));

  return {
    type: "output",
    content: userArg
      ? `${emoji} Cookie ${action} ${userArg}!`
      : `${emoji} Cookie ${action} itself... adorable!`,
    className: "text-amber-700",
  };
}


  private handleCookieJarCommands(baseCmd: string, args: string[]): CommandResult {
  switch (baseCmd) {
    case "cookie bake":
      return {
        type: "output",
        content: "🍪 You bake a batch of delicious cookies. Yum!",
        className: "text-amber-700",
      };
    case "cookie eat":
      return {
        type: "output",
        content: "😋 You eat a cookie. Sweet and satisfying.",
        className: "text-amber-700",
      };
    case "cookie fortune":
      return {
        type: "output",
        content: this.getRandomFortune(),
        className: "text-amber-700 italic",
      };
    case "cookie fun":
      return {
        type: "output",
        content:
          "Fun commands include: hug, pat, love, give, vibe. Try 'cookie hug @user'.",
        className: "text-amber-700",
      };

    // 🎉 Fun Commands
    case "cookie hug":
      return this.createFunResponse("🤗", "hugs", args);
    case "cookie pat":
      return this.createFunResponse("🖐️", "pats", args);
    case "cookie love":
      return this.createFunResponse("❤️", "sends love to", args);
    case "cookie give":
      return this.createFunResponse("🎁", "gives a cookie to", args);
    case "cookie vibe":
      return this.createFunResponse("🎶", "starts vibing with", args);

    default:
      return {
        type: "output",
        content: `Unknown cookie jar command: "${baseCmd}". Try 'cookie help'.`,
        className: "text-red-600",
      };
  }
}


  private handleEvilCookieJarCommands(baseCmd: string, args: string[]): CommandResult {
    // Find optional user mention argument starting with '@'
    const userArg = args.find((arg) => arg.startsWith("@"));

    switch (baseCmd) {
      case "cookie bonk":
        return {
          type: "output",
          content: userArg
            ? `☠️ Evil cookie bonks ${userArg} and shatters reality!`
            : "☠️ Evil cookie bonks itself... ouch!",
          className: "text-rose-700",
        };
      case "cookie throw":
        return {
          type: "output",
          content: userArg
            ? `💥 Evil cookie throws a cookie at ${userArg}! Watch out!`
            : "💥 Evil cookie throws cookies everywhere!",
          className: "text-red-700",
        };
      case "cookie fight":
        return {
          type: "output",
          content: userArg
            ? `🥊 Evil cookie fights fiercely with ${userArg}!`
            : "🥊 Evil cookie fights with itself... epic battle!",
          className: "text-red-800",
        };
      case "cookie angry":
        return {
          type: "output",
          content: userArg
            ? `😠 Evil cookie is angry at ${userArg}. Crumbs fly!`
            : "😠 Evil cookie is furious... crumbs everywhere!",
          className: "text-red-600",
        };
      case "cookie jealous":
        return {
          type: "output",
          content: userArg
            ? `😤 Evil cookie is jealous of ${userArg}. Beware!`
            : "😤 Evil cookie is jealous... silently seething.",
          className: "text-red-600",
        };
      default:
        return {
          type: "output",
          content: `Unknown evil cookie jar command: "${baseCmd}". Try 'cookie help'.`,
          className: "text-red-600",
        };
    }
  }

  private getRandomFortune(): string {
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  }
}