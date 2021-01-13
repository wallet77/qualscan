class AbstractPluginReporter {
    constructor (cmd) {
        if (this.constructor === AbstractPluginReporter) {
            throw new TypeError('Abstract class "AbstractPluginReporter" cannot be instantiated directly')
        }

        this.cmd = cmd
    }

    verbose () { console.log(this.cmd.data) }
}

module.exports = AbstractPluginReporter
