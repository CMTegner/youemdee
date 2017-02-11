const getName = require('./get-dependency-name.js')

module.exports = function createEpilogue (deps) {
  return `)(1)
  })(function newRequire (name) {
    ${deps.map((dep, i) => `if (name === '${getName(dep, 'cjs')}') return dep${i}`).join('\n')}
    if (typeof require !== 'undefined') return require(name)
    var err = new Error("Cannot find module '" + name + "'")
    err.code = 'MODULE_NOT_FOUND'
    throw err
  })
})`
}
