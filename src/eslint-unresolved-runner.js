// eslint-unresolved-runner.js

const { ESLint } = require("eslint");

module.exports = function (opts) {
    return new Promise((async (resolve, reject) => {
        const eslintOverride = opts.eslintOverride;
        const { ESLint } = require("eslint");
        const eslint = new ESLint({
            overrideConfigFile: 'node_modules/wdio-eslinter-service/src/config/eslintrc-conf-unresolved-only.js',
            useEslintrc: opts.includeProjectEslintrc,
            baseConfig: eslintOverride
        });
        const results = await eslint.lintFiles(["."]);
        let hasErrors = false;
        results.forEach((result) => {
            if (result.messages.length === 0)
                return;
            const allRulesAreNull = result.messages.reduce((acc, message, index) => {
                if (message.ruleId !== null)
                    acc = false;
                return acc;
            }, true);
            if (allRulesAreNull)
                return;
            console.log(`${result.filePath}`);
            result.messages.forEach((message) => {
                let type;
                if (message.severity === 1)
                    type = 'warning';
                else if (message.severity === 2) {
                    type = 'error';
                    hasErrors = true;
                } else
                    type = 'message';
                console.log(`  ${message.line}:${message.column}  ${message.severity}-${type}  ${message.message}  ${message.ruleId}`);
            });
            console.log('\n');
        });
        if(hasErrors)
            reject('Errors found');
        else
            resolve();
        //console.log(results)
    }));
}

