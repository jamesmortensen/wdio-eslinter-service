// eslint-yarn-runner.js

const { spawn } = require('child_process');

module.exports = function (scriptName) {
    return new Promise((resolve, reject) => {
        const yarnCmd = process.platform.match('^win') !== null ? 'yarn.cmd' : 'yarn';
        const eslint = spawn(yarnCmd, [scriptName, '--quiet'], { stdio: "inherit" });

        eslint.on('close', (code) => {
            if (code !== 0)
                reject(code);
            else
                resolve(code);
        });
    });
}
