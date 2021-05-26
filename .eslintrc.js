module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:@typescript-eslint/eslint-recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    semi: 0,
    'arrow-parens': 0,
    'react/jsx-one-expression-per-line': 0,
    'padded-blocks': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'react/no-array-index-key': 0,
    'jsx-filename-extension': 0,
    indent: 'off',
    curly: [2, 'all'],
    'object-curly-newline': 0,
    'react/prop-types': 0,
    'no-restricted-syntax': 0,
    'no-unused-expressions': 'off',
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-trailing-spaces': 1,
    'no-multiple-empty-lines': 1,
    'no-use-before-define': 'off',
    'implicit-arrow-linebreak': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'max-len': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'guard-for-in': 0,
    'default-case': 0,
    'prefer-template': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-indent': 1,
    'arrow-body-style': 0,
    'react/no-unused-prop-types': 0,
    'import/prefer-default-export': 0,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    radix: 0,
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
}
