const Module = require('module')

const originalLoad = Module._load
let parent = null
const ancestors = []
const deps = {}

const customLoad = function () {
    const name = arguments[0]
    let err

    const module = {
        children: {},
        duration: null
    }

    if (parent) {
        parent.children[name] = module
    } else {
        deps[name] = module
    }

    const started = process.hrtime()
    let originalCall = null

    // If the original Module._load fail here, rethrow it
    try {
        ancestors.push(parent)
        parent = module
        originalCall = originalLoad.apply(Module, arguments)
    } catch (e) {
        err = e
    }
    const duration = process.hrtime(started)

    parent = ancestors.pop()
    module.duration = duration[0] * 1e9 + duration[1]

    if (err) {
        throw err
    }

    return originalCall
}

Module._load = customLoad

try {
    require(process.env.MODULE)
} catch (err) {
    deps.err = err
}

process.send(deps)

process.exit(0)
