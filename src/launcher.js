const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-eslint-service')

class EslintLauncherService {

    constructor(serviceOptions, capabilities, config) {
        this.options = serviceOptions ? serviceOptions : {}
        if(!this.options.runnerType)
            this.options.runnerType = 'npm';
        logger.warn(`initialize wdio-eslint-service using ${this.options.runnerType} runner.`)
    }

    onPrepare(config, capabilities) {
        return new Promise((resolve, reject) => {
            const { SevereServiceError } = require('webdriverio')
            const runEslint = require(`./eslint-${this.options.runnerType}-runner`)
            return runEslint().then((code) => {
                logger.info('eslint checks passed...')
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            logger.error('SEVERE: Code contains eslint errors or eslint not installed. Exiting...')
            process.exit(1)
        })
    }
}

module.exports = EslintLauncherService;
