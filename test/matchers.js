const customMatchers = {
    toHaveClass() {
        return {
            compare(actual, expected) {
                let result = {};
                result.pass = actual.hasClass(expected);
                result.message =
                    `Expected element ${result.pass ? ' not ' : ' '} to have class '${expected}' but found '${actual.attr('class')}'`;
                return result;
            }
        };
    }
};
