module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jasmine: true,
        jquery: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module',
        impliedStrict: true
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'curly': 'error',
        'eqeqeq': ['error', 'always'],
        'no-empty': 'error',
        'no-undef': 'error',
        'no-eq-null': 'error',
        'no-extend-native': 'error',
        'no-caller': 'error',
        'new-cap': ['error', { capIsNew: false }]
    },
    globals: {
        angular: true,
        module: true,
        inject: true,
        tagsInput: true,
        range: true,
        changeElementValue: true,
        customMatchers: true,
        KEYS: true,
        MAX_SAFE_INTEGER: true,
        SUPPORTED_INPUT_TYPES: true
    }
};