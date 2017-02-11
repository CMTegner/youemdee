const { readFileSync } = require('fs')
const { spawnSync } = require('child_process')
const fixture = readFileSync(`${__dirname}/fixture.js`, 'utf-8')

function run (args = [], input) {
  return spawnSync(`${__dirname}/../youemdee.js`, args, { encoding: 'utf-8', input })
}

test('Help text and failure on no args', () => {
  const { stdout, stderr, status } = run()
  expect(status).toBe(1)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('Help text and success on -h', () => {
  const { stdout, stderr, status } = run(['-h'])
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('Help text and success on --help', () => {
  const { stdout, stderr, status } = run(['--help'])
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('UMD bundle with no dependencies', () => {
  const { stdout, stderr, status } = run(['MyModule'], fixture)
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('UMD bundle with no input source map', () => {
  const { stdout, stderr, status } = run(['MyModule'], 'foo()')
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('UMD bundle with single dependency', () => {
  const { stdout, stderr, status } = run(['MyModule', '-d', 'dep1'], fixture)
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('UMD bundle with multiple dependencies', () => {
  const { stdout, stderr, status } = run(['MyModule', '-d', 'dep1', '-d', 'dep2', '--dependency', 'dep3'], fixture)
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('Dependency with different local and global name', () => {
  const { stdout, stderr, status } = run(['MyModule', '-d', 'dep1:GLOBAL1'], fixture)
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})

test('Dependency with different local, global, and amd name', () => {
  const { stdout, stderr, status } = run(['MyModule', '-d', 'dep1:GLOBAL1:amd1'], fixture)
  expect(status).toBe(0)
  expect(stdout).toMatchSnapshot()
  expect(stderr).toBe('')
})
