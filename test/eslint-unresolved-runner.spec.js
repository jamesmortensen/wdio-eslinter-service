const expect = require('chai').expect

describe('Unresolved runner type Platform Tests', () => {
    it('should find a single eslint error and report it', (done) => {
        const runEslint = require('../src/eslint-unresolved-runner')
        runEslint({ 
            runnerType: 'unresolved',
            configFilePath: 'src/config/eslintrc-conf-unresolved-only.js'
        }).then((res) => {
            console.log(res)
            done(new Error('Expected an eslint error but did not get one'))
        }).catch((err) => {
            console.log(err)
            expect(err.formattedResults[0]).to.contain('Unable to resolve path to module \'zxcvbn\'.  import/no-unresolved')
            expect(err.formattedResults.length).to.equal(1)
            done()
        });
    })
});