module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 0,
    'no-useless-constructor': 0,
    'no-cond-assign': 0,
    'no-undef': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      'multiline': {
        'delimiter': 'none',
      },
    }],
    'import/no-mutable-exports': 0,
    'no-return-await': 0,
    'no-console': 0,
    'prefer-const': 0,
    'import/named': 0,
    'import/no-named-as-default-member': 0,
  },
}
