import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
