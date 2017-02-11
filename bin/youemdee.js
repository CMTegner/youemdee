#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')
const { createTransform } = require('../src/youemdee.js')

function printUsageAndExit (statusCode) {
  const rs = fs.createReadStream(`${__dirname}/usage.txt`)
  rs.pipe(process.stdout)
  rs.on('end', () => process.exit(statusCode))
}

const args = minimist(process.argv.slice(2), {
  alias: {
    d: ['dependency'],
    h: ['help'],
  },
})

if (args.h) {
  printUsageAndExit(0)
} else if (args._.length !== 1) {
  printUsageAndExit(1)
} else {
  const deps = [].concat(args.d)
    .filter(v => v)
    .map(dep => dep.split(':'))
    .map(([name, global, amd]) => ({ name, global, amd }))

  process.stdin
    .pipe(createTransform(args._[0], deps))
    .pipe(process.stdout)
}
