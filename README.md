# youemdee [![Build Status](https://travis-ci.org/CMTegner/youemdee.svg?branch=master)](https://travis-ci.org/CMTegner/youemdee)

Wrap a browserify/browser-pack JavaScript bundle in a Universal Module Definition (UMD) with optional external dependencies, while preserving source maps.

## Example

Plug this into your build chain just as you would with any other transform-stream:

```bash
browserify src/main.js | youemdee MyModule --dependency dep1
```

Or if you're using the Node API:

```js
browserify('./src/main.js')
  .bundle()
  .pipe(youemdee.createTransform('MyModule', dependencies))
  .pipe(process.stdout)
```

## Usage

```
youemdee

  Reads a browserify/browser-pack JavaScript bundle from stdin and wraps it in a Universal Module Definition (UMD) with optional external dependencies. An optional source map can be provided inline in the input, and will be updated and output inline with the UMD bundle on stdout.

Synopsis

  $ youemdee <module-name>

  It is highly encouraged to stick to [a-zA-Z] for module-name, as anything else will make accessing your module in the global scope more difficult (window.MyModule vs. window['my-module']).

Options

  -h, --help         Display this usage guide
  -d, --dependency   A dependency in the form of name[:global[:amd]], multiple occurrences allowed

Examples

  No external dependencies               $ youemdee MyModule < bundle.js
  React and ReactDOM as external deps.   $ youemdee MyComponent --dependency react:React --dependency react-dom:ReactDOM < bundle.js
```

## API

```
const youemdee = require('youemdee')
```

#### `youemdee(source:String, moduleName:String, dependencies:Array): String`

Will wrap `source` in a UMD. If there is an inline source map found in `source` it will be extracted, updated to reflect the changes made, then reattached inline to the returned string.

`moduleName` is the namespace which the module will have when attached to the global scope, e.g. `window.MyModule`. It is highly encouraged to stick to [a-zA-Z] so as not to make accessing your module unnecessarily difficult.

The optional `dependencies` is an array. Each entry can either be a string or a dependency spec of the following form:

```js
{
  name: String, // The internal and external CJS name
  amd: String, // Dep. name as defined in the AMD loader
  global: String, // Dep. name in the global scope
}
```

When specified as a string the value will be used for internal, external, amd, and global dependency names.

#### `youemdee.createTransform(moduleName:String, dependencies:Array): Transform`

Just like `youemdee()`, but instead of expecting source as an argument it returns a transform stream which reads until end, wraps in a UMD, and emits the updated bundle. Very useful in a stream-style build pipeline.

## Why?

browserify's `--standalone` works well as long as you don't have any external dependencies. [umd](https://www.npmjs.com/package/umd) itself (which browserify uses indirectly via browser-pack) doesn't yet support external dependencies.

## Future
This tool targets browserify (or more specifically: browser-pack) bundles. It will, in theory, also work for other JavaScript bundlers that create a similar pseudo-`require` output. PRs to add support for other types of input are more than welcome.

## Compatibility
Node >=6. This is only due to the level of syntactic sugar used. Writing the code down to support older versions of node won't be too much work, if the demand is there to support it.

## License

ISC
