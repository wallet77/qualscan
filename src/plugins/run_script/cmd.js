'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

class Script {
    constructor (title, cmd) {
        this.cmd = cmd
        this.title = title
        this.data = null
        this.level = null
        utils.loadReporters(this, __dirname)
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
