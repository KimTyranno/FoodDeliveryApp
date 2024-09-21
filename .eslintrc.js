module.exports = {
  root: true,
  extends: ['@react-native', 'standard'],
  plugins: ['@stylistic/js'],
  rules: {
    semi: 0,
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 2,
    '@stylistic/js/indent': ['error', 2],
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
  },
}
