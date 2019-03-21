module.exports = {
  parser: '@typescript-eslint/parser',
	env: {
	  browser: true
	},
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    // 'prettier/babel',
    'prettier/standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      modules: true
    },
    ecmaVersion: 2018,
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: './'
  },
  plugins: [
    '@typescript-eslint',
    // 'babel',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  overrides: [{
    'files': ['*.js', '*.ts'],
    'rules': {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
    }
  }],
};
