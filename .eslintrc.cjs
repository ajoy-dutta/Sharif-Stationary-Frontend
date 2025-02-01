// .eslintrc.cjs
module.exports = {
    env: {
      browser: false,   // Turn off browser-specific globals
      node: true,       // Enable Node.js globals like `require`
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',  // React plugin if using React
    ],
    parserOptions: {
      ecmaVersion: 12,  // Supports ECMAScript 2021
      sourceType: 'module', // Allows using ES modules (if needed)
    },
    rules: {
      'no-console': 'warn',
      'indent': ['error', 2],
    },
    plugins: ['react'],  // React plugin if using React
  };
  