'use strict'
const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    callback: async (error, stdout, stderr) => {
        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.error = error
        }

        if (data.metadata.vulnerabilities.critical > 0 || data.metadata.vulnerabilities.high > 0) {
            cmd.level = 'fail'
        } else if (data.metadata.vulnerabilities.moderate > 0 || data.metadata.vulnerabilities.low > 0) {
            cmd.level = 'warn'
        } else if (data.metadata.vulnerabilities.info > 0) {
            cmd.level = 'info'
        }

        return cmd
    }
}

module.exports = cmd
