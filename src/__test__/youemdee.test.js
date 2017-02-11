const { readFileSync, createReadStream } = require('fs')
const concat = require('concat-stream')
const fromString = require('from2-string')
const youemdee = require('../youemdee.js')

const fixture = readFileSync(`${__dirname}/fixture.js`, 'utf-8')

test('UMD bundle with no dependencies', () => {
  const result = youemdee(fixture, 'MyModule')
  expect(result).toMatchSnapshot()
})

test('UMD bundle with no input source map', () => {
  const result = youemdee('foo()', 'MyModule')
  expect(result).toMatchSnapshot()
})

test('UMD bundle with single dependency', () => {
  const result = youemdee(fixture, 'MyModule', [{ name: 'dep1' }])
  expect(result).toMatchSnapshot()
})

test('UMD bundle with multiple dependencies', () => {
  const result = youemdee(fixture, 'MyModule', [
    { name: 'dep1' },
    { name: 'dep2' },
    { name: 'dep3' },
  ])
  expect(result).toMatchSnapshot()
})

test('Dependency with different local and global name', () => {
  const result = youemdee(fixture, 'MyModule', [{
    name: 'dep1',
    global: 'GLOBAL1',
  }])
  expect(result).toMatchSnapshot()
})

test('Dependency with different local, global, and amd name', () => {
  const result = youemdee(fixture, 'MyModule', [{
    name: 'dep1',
    global: 'GLOBAL1',
    amd: 'amd1',
  }])
  expect(result).toMatchSnapshot()
})

test('Dependency with different local, global, and amd name', () => {
  const result = youemdee(fixture, 'MyModule', [{
    name: 'dep1',
    global: 'GLOBAL1',
    amd: 'amd1',
  }])
  expect(result).toMatchSnapshot()
})

test('Dependency specified as string', () => {
  const result = youemdee(fixture, 'MyModule', ['dep1', {
    name: 'dep2',
    global: 'GLOBAL2',
    amd: 'amd2',
  }, 'dep3'])
  expect(result).toMatchSnapshot()
})

test('Should optionally create a transform-stream', () => {
  const transform = youemdee.createTransform('MyModule', [{
    name: 'dep1',
    global: 'GLOBAL1',
    amd: 'amd1',
  }])
  return new Promise((resolve, reject) => {
    createReadStream(`${__dirname}/fixture.js`)
      .pipe(transform)
      .pipe(concat(result => {
        expect(result.toString()).toMatchSnapshot()
        resolve()
      }))
  })
})

test('Large input size', () => {
  let src = ''
  for (let i = 0; i < 100000; i++) { // Creates ~3M of JS
    src += `function foo() { return 'bar' }\n`
  }
  const transform = youemdee.createTransform('MyModule')
  return new Promise((resolve, reject) => {
    fromString(src)
      .pipe(transform)
      .pipe(concat(resolve)) // Nothing to check, if it ends everything's fine
  })
})
