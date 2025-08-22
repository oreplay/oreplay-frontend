/**
 * @type {import('i18next-parser').Options}
 */
const config = {
  // Where to read/write catalogs
  locales: ["en", "es"],
  output: "public/locales/$LOCALE/$NAMESPACE.json",

  // What to scan
  input: ["src/**/*.{js,jsx,ts,tsx}"],

  // React-friendly: parse JSX everywhere (even in .js files)
  lexers: {
    js: [{ lexer: "JsxLexer" }],
    jsx: [{ lexer: "JsxLexer" }],
    ts: [{ lexer: "JavascriptLexer" }],
    tsx: [{ lexer: "JsxLexer" }],
  },

  defaultNamespace: "translation",
  keySeparator: ".",
  namespaceSeparator: ":",

  // Keep catalogs tidy
  defaultValue: "",
  indentation: 2,

  // How to handle removed/unused keys:
  createOldCatalogs: false, // back up removed keys to <namespace>_old.json
  keepRemoved: false, // remove from main catalogs (but backed up in *_old.json)
}

export default config
