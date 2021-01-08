const filesize = require('filesize')
module.exports = {
    format: (value, metric) => {
        return metric !== 'entryCount' && !isNaN(value) ? filesize(value, { base: 10 }) : value
    }
}
