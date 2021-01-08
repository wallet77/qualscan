class AbstractReporter {
    constructor () {
        if (this.constructor === AbstractReporter) {
            throw new TypeError('Abstract class "AbstractReporter" cannot be instantiated directly')
        }
    }

    displayBudgets () { throw new Error('Method displayBudgets should be implemented!') }
    displayVerbose () {}
    displaySkippedPlugins () { throw new Error('Method displaySkippedPlugins should be implemented!') }
    displaySkippedScripts () { throw new Error('Method displaySkippedScripts should be implemented!') }
    displayScore () { throw new Error('Method displayScore should be implemented!') }
    start () { throw new Error('Method start should be implemented!') }
    end () { throw new Error('Method end should be implemented!') }
}

module.exports = AbstractReporter
