module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: false,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-organize-imports'],
  importOrder: ['^@mui/(.*)$', '^@untitled-ui/(.*)$', '^react', '^src/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
