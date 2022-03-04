// eslint-unresolved-runner.js

const { spawn } = require('child_process');

module.exports = function (opts) {
    const no_eslintrc = '--no-eslintrc';
    return new Promise((resolve, reject) => {
        const npxCmd = process.platform.match('^win') !== null ? 'npx.cmd' : 'npx';
        const eslint = spawn(npxCmd, ['eslint', '-c', 'node_modules/wdio-eslinter-service/src/config/eslintrc-conf-unresolved-only.js', '.'].reduce((args, arg, index) => {
            if(index === 1)
                if(!opts.includeProjectEslintrc)
                    args.push(no_eslintrc);
            args.push(arg);
            return args;
        }, []), { stdio: "inherit" });

        eslint.on('close', (code) => {
            if (code !== 0)
                reject(code);
            else
                resolve(code);
        });
    });
}

