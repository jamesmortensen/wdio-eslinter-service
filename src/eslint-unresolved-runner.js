// eslint-unresolved-runner.js

const { ESLint } = require("eslint");
const configFilePath = 'node_modules/wdio-eslinter-service/src/config/eslintrc-conf-unresolved-only.js';

module.exports = function (opts) {

    return new Promise((async (resolve, reject) => {
        try {
            const eslintOverride = opts.eslintOverride;
            const eslint = new ESLint({
                overrideConfigFile: opts.configFilePath || configFilePath,
                useEslintrc: opts.includeProjectEslintrc,
                baseConfig: eslintOverride
            });
            const results = await eslint.lintFiles(["."]);
            let hasErrors = false;
            const formattedResults = [];
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
                    formattedResults.push(`  ${message.line}:${message.column}  ${message.severity}-${type}  ${message.message}  ${message.ruleId}`)
                    console.log(formattedResults[formattedResults.length - 1]);
                });
                console.log('\n');
            });
            if (hasErrors)
                reject({ message: 'eslint-errors', formattedResults});
            else
                resolve();
            //console.log(results)
        } catch (e) {
            console.error(e);
        }
    }))
}

