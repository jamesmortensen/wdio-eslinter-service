const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-eslinter-service')

class EslintLauncherService {

    constructor(serviceOptions, capabilities, config) {
        this.options = serviceOptions ? serviceOptions : {}
        if(!this.options.runnerType)
            this.options.runnerType = 'npm';
        if(!this.options.scriptName)
            this.options.scriptName = 'eslint';
        if(!this.options.includeProjectEslintrc)
            this.options.includeProjectEslintrc = false;
        logger.warn(`initialize wdio-eslinter-service using ${this.options.runnerType} runner.`)
    }

    onPrepare(config, capabilities) {
        return new Promise((resolve, reject) => {
            const { SevereServiceError } = require('webdriverio')
            const runEslint = require(`./eslint-${this.options.runnerType}-runner`)
            return runEslint(this.options).then((code) => {
                logger.info('eslint checks passed...')
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            const type = this.options.runnerType
            if(customErrorHandlerExists(type))
                handleErrorsWithErrorHandler(type, err)
            else
                logger.error('SEVERE: Code contains eslint errors or eslint not installed. Exiting...')
            process.exit(1)
        })
    }
}

const fs = require('fs')

function customErrorHandlerExists(type) {
    const eslintErrorHandlerFile = `eslint-${type}-error-handler.js`
    return fs.existsSync(`node_modules/wdio-eslinter-service/src/${eslintErrorHandlerFile}`)
}

function handleErrorsWithErrorHandler(type, err) {
    const eslintErrorHandlerFile = `eslint-${type}-error-handler.js`
    const eslintErrorHandler = require(`./${eslintErrorHandlerFile}`)
    eslintErrorHandler.handleError(err)
}

module.exports = EslintLauncherService;
