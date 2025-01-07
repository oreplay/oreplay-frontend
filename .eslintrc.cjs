module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "jsonc"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: "first",
        outerIIFEBody: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: ["TemplateLiteral *", "ConditionalExpression", "CallExpression"],
      },
    ],
    "jsonc/indent": ["error", 2], // Ensures 2 space indentation
    "jsonc/key-spacing": ["error", { beforeColon: false, afterColon: true }], // Ensures no space before colon and space after colon
  },
  overrides: [
    {
      files: ["*.json"],
      parser: "jsonc-eslint-parser",
    },
  ],
};
