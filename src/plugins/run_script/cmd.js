'use strict'
class Script {
    constructor (title, cmd) {
        this.cmd = cmd
        this.title = title
        this.data = null
        this.level = null
    }

    async callback (error, stdout) {
        this.data = stdout
        this.level = 'succeed'

        if (error) {
            this.level = 'fail'
            this.error = error
        }

        return this
    }
}

module.exports = Script
