const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-eslinter-service')


function handleError(err) {
    logger.error('SEVERE: Code contains eslint errors. Exiting...')
}

module.exports = {
    handleError
}