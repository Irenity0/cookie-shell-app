// src/commands/easterEggs.ts
import type { CommandResult } from "@/types/terminal";

export const cookieEasterEggs = {
  "cookie summon": (): CommandResult => {
    const guardians = [
      "🍪 The Cookie Guardian emerges from the doughy depths...",
      "👻 A spectral cookie appears and whispers secrets of the oven.",
      "🧙‍♂️ The Great Cookie Wizard blesses your terminal!",
      "🐉 A cookie dragon flaps its wings and vanishes in crumbs."
    ];
    return {
      type: "output",
      content: guardians[Math.floor(Math.random() * guardians.length)],
      className: "text-yellow-600",
    };
  },

  "cookie hack": (): CommandResult => {
    const hackingSteps = [
      "Initializing cookie hack...",
      "Bypassing chocolate firewall...",
      "Injecting sprinkle script...",
      "Extracting recipe.exe...",
      "🍪 SUCCESS: Gained access to the secret cookie vault."
    ];
    return {
      type: "output",
      content: hackingSteps.join("\n"),
      className: "text-green-600 font-mono",
    };
  },

  "cookie glitch": (): CommandResult => {
    const glitchText = `g̷̖̟̤̲̹̘͗͛͐l̷̡̬͓̈́̔̓̓͌͘̚͜͜͝į̴̖̝̱̱͙͖͍̟̈́̒͘͠t̴̢͖̜͉̲̰͔̺͔̋̀͝c̴͉͙̝̰͚͍̥͐͆͋͒̍̈́̆̐͠ͅh̵̻̮͙͙̤͈̾̃̆͐̇͆̚ ̴̢̛̰͎͖͎̭̩̱̜̤̍͐̍͛͋͆̚͠ẻ̴̤̬̱̳͇̼̜̪̍͐͊̑̎͝ř̵̖̘̼̻̼̞̖̳̀͋̏͂̿̚ͅr̵̰̬̥̪̥̹͔͓̖̈́̓͂͠o̸͕̳͕͉͙̞͕̎̓͊̈́̎́̈́͗̐͝r̵͎̭̟͙̜̱̄͋̒̾̄̀͛̚͝`;
    return {
      type: "output",
      content: glitchText,
      className: "text-pink-700",
    };
  },

  "cookie cookie": (): CommandResult => {
    return {
      type: "output",
      content: "🍪🍪 Double cookie power activated!",
      className: "text-orange-600",
    };
  },

  "cookie ascii": (): CommandResult => {
    return {
      type: "output",
      content: `      ( (
       ) )
    ........
    |      |]
    \      /
     \`----'
A digital cookie just for you 🍪`,
      className: "text-amber-600 font-mono",
    };
  },

  "cookie self-destruct": (): CommandResult => {
    return {
      type: "output",
      content: `💣 Initiating self-destruct sequence...\n3...\n2...\n1...\n💥 Just kidding. Cookies are immortal.`,
      className: "text-red-600",
    };
  },

  "cookie lore": (): CommandResult => {
    return {
      type: "output",
      content: `🍪 In the beginning, there was only flour and fire...\nFrom the chaos, Cookie Shell was baked into existence by the Eldest Crumb.\nFew know the recipe. Fewer still know the price.`,
      className: "text-yellow-700 italic",
    };
  },

  "cookie matrix": (): CommandResult => {
    const matrix = Array.from({ length: 12 }, () =>
      Array.from({ length: 32 }, () => Math.round(Math.random())).join("")
    ).join("\n");

    return {
      type: "output",
      content: `🟢 Cookie Matrix Loaded:\n<pre>${matrix}</pre>`,
      className: "text-green-500 font-mono",
    };
  },
};