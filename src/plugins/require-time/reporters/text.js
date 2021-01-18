const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))
const utils = require(path.join(__dirname, '../../utils.js'))
// const util = require('util')

// const formatTree = (tree, opts = {}, level = 0) => {
//     const indent = opts.indent === undefined ? '  ' : opts.indent
//     const maxDepth = opts.maxDepth === undefined ? Infinity : opts.maxDepth

//     if (level > maxDepth) {
//         return ''
//     }

//     let output = ''

//     Object.keys(tree).forEach(function (name) {
//         const node = tree[name]

//         const duration = node.duration
//         const children = node.children

//         const secs = ((duration[0] * 1000) + Math.round(duration[1] / 1e6)) / 1000
//         const time = util.format('%ss', secs.toFixed(3))

//         const line = util.format('%s %s %s\n',
//             new Array(level + 1).join(indent),
//             name,
//             time)

//         output += line

//         output += formatTree(children, opts, level + 1)
//     })

//     return output
// }

class TextReporter extends AbstractPluginReporter {
    verbose () {
        console.log(`Entrypoint require time: ${utils.prettyNano(this.cmd.data.entrypointTime)}`)
    }
}

module.exports = TextReporter
