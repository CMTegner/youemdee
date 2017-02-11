const { fromSource, removeComments, fromObject } = require('convert-source-map')
const { SourceMapConsumer, SourceNode } = require('source-map')
const through = require('through2')
const createPrologue = require('./create-prologue.js')
const createEpilogue = require('./create-epilogue.js')

function youemdee (src, name, deps = []) {
  const prologue = createPrologue(name, deps)
  const epilogue = createEpilogue(deps)
  const map = fromSource(src)
  if (map) {
    const consumer = new SourceMapConsumer(map.toJSON())
    const node = SourceNode.fromStringWithSourceMap(removeComments(src), consumer)
    node.prepend(prologue)
    node.add(epilogue)
    const updated = node.toStringWithSourceMap()
    return updated.code + '\n' + fromObject(updated.map).toComment()
  } else {
    return prologue + src + epilogue
  }
}

function createTransform (name, deps) {
  let src = ''

  function transform (data, enc, cb) {
    src += data.toString()
    cb()
  }

  function flush (cb) {
    cb(null, youemdee(src, name, deps))
  }

  return through(transform, flush)
}

module.exports = youemdee
module.exports.createTransform = createTransform
