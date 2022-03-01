// eslint-npm-runner.js

const { spawn } = require('child_process');

module.exports = function (scriptName) {
    return new Promise((resolve, reject) => {
        const npmCmd = process.platform.match('^win') !== null ? 'npm.cmd' : 'npm';
        const eslint = spawn(npmCmd, ['run', scriptName, '--silent'], { stdio: "inherit" });

        eslint.on('close', (code) => {
            if (code !== 0)
                reject(code);
            else
                resolve(code);
        });
    });
}
