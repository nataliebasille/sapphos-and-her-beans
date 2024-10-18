import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import natcore from "@natcore/design-system-core/src/plugin";
import { toRgb } from "@natcore/design-system-core/src/utils";
import { withUt } from "uploadthing/tw";

export default withUt({
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
}) satisfies Config;
