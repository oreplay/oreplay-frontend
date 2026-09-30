/** @type {import('tailwindcss').Config} */
export default {
  // Preflight (Tailwind's global reset) is OFF: this module mounts inside the
  // host SPA's DOM, and a global reset would restyle the host's own elements.
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Mirror the host's MUI default font stack so the module renders in the
        // same typeface. The host sets no `<body>` font (no CssBaseline), so we
        // can't `inherit` — Nimbus Sans only appears because "Helvetica" in this
        // stack is substituted by it on Linux. Applied on the `.tw-root` wrapper
        // in RankingRoutes so it cascades to the whole module.
        sans: ['"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"],
      },
      colors: {
        // Channel-format CSS vars (see src/styles/tokens.css) so opacity
        // utilities like `bg-primary/50` work. These are our OWN semantic vars.
        medal: {
          bronze: {
            DEFAULT: "rgb(var(--color-medal-bronze) / <alpha-value>)",
            ink: "rgb(var(--color-medal-bronze-ink) / <alpha-value>)",
            light: "rgb(var(--color-medal-bronze-light) / <alpha-value>)",
          },
          gold: {
            DEFAULT: "rgb(var(--color-medal-gold) / <alpha-value>)",
            ink: "rgb(var(--color-medal-gold-ink) / <alpha-value>)",
            light: "rgb(var(--color-medal-gold-light) / <alpha-value>)",
          },
          silver: {
            DEFAULT: "rgb(var(--color-medal-silver) / <alpha-value>)",
            ink: "rgb(var(--color-medal-silver-ink) / <alpha-value>)",
            light: "rgb(var(--color-medal-silver-light) / <alpha-value>)",
          },
        },
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
