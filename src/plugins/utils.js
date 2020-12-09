module.exports = {
    parseData: (cmd, error, stdout, stderr) => {
        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.error = error
        }
    }
}
