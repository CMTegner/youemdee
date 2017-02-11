const getName = require('./get-dependency-name.js')

module.exports = function createPrologue (name, deps) {
  return `(function (g, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory(${deps.map(dep => `require('${getName(dep, 'cjs')}')`).join(', ')})
    } else if (typeof define === 'function' && define.amd) {
        define([${deps.map(dep => `'${getName(dep, 'amd')}'`).join(', ')}], factory)
    } else {
        g['${name}'] = factory(${deps.map(dep => `g['${getName(dep, 'global')}']`).join(', ')})
    }
})(this, function (${deps.map((_, i) => `dep${i}`).join(', ')}) {
  return (function (require) {
    var define, module, exports // Reset to avoid causing problems for any nested UMDs
    return (`
}
