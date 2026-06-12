/** @type {import('tailwindcss').Config} */
export default {
  // Prefix so utilities never collide with MUI / host classes while both coexist.
  prefix: "tw-",
  // Disable the reset so Tailwind does not fight MUI's baseline styles.
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Channel-format CSS vars (see src/styles/tokens.css) so opacity
        // utilities like `tw-bg-primary/50` work. These are our OWN semantic
        // vars — never bind to MUI's internal `--mui-palette-*` names.
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
