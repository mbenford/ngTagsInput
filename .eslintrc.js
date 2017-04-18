module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module'
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
        jQuery: true,
        document: true,
        $: true,
        beforeEach: true,
        afterEach: true,
        describe: true,
        it: true,
        expect: true,
        jasmine: true,
        spyOn: true,
        require: true,
        tagsInput: true,
        range: true,
        changeElementValue: true,
        customMatchers: true,
        KEYS: true,
        MAX_SAFE_INTEGER: true,
        SUPPORTED_INPUT_TYPES: true
    }
};