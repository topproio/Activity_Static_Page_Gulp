/**
 * @file ESLint Configuring
 * @description
 * Please visit [ESLint Rules]{@link https://eslint.org/docs/rules/}
 */

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        'ecmaVersion': 6,
        'sourceType': 'module'
    },
    globals: {
        "$": true,
    },
    env: {
        browser: true,
        node: true,
    },
    extends: ['toppro'],
    rules: {}
}
