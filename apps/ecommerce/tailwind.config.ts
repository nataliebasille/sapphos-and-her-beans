import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import natcore from "@nataliebasille/natcore-design-system/plugin";
import { toRgb } from "@nataliebasille/natcore-design-system/utils"

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    natcore({
      primary: toRgb("#001F36"),
      secondary: toRgb("#E87A01"),
      surface: toRgb("#F7DCDF"),
    }),
  ],
} satisfies Config;
