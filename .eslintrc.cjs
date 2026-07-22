module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "vue/multi-word-component-names": "error",
    "vue/no-unused-vars": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    eqeqeq: ["error", "always"],
  },
  overrides: [
    {
      files: ["src/views/**/index.vue"],
      rules: { "vue/multi-word-component-names": "off" },
    },
  ],
}
