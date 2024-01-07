module.exports = {
  root: true,
  extends: "eslint:recommended",
  parser: "@babel/eslint-parser",
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
    ecmaVersion: "latest",
  },
  rules: {
    "max-len": 0,
    "no-underscore-dangle": 0,
    "no-trailing-spaces": 0,
    "sort-imports": 0,
  },
};
