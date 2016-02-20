# cdnex
[![Build Status](https://travis-ci.org/jsonmaur/cdnex.svg?branch=master)](https://travis-ci.org/jsonmaur/cdnex)

Creates an easy way to prepend your CDN urls to your HTML and CSS files. It can be integrated into any existing workflow, and customized to meet the needs of your project. Use the CLI tool or implement programmatically using the API.

## Getting Started
```bash
npm install cdnex --save
# or to use the cli globally #
npm install cdnex -g
```

- [Usage with CLI](#cli)
- [Usage with API](#api)
  - [.render()](#api-render)
  - [Examples](#api-examples)
- [Extensions](#extensions)
- [Testing and Contributing](#help)

<a name="cli"></a>
## CLI

If installed globally, `cdnex` will be in your system path.

```bash
$ cdnex src/index.html --output dist/index.html --cdn https://mycdn.com

# you can also specify directories #
$ cdnex src -o dist -c https://mycdn.com

# options #
Usage:  cdnex <file or directory> [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -c, --cdn <url>          cdn url to use
    -o, --output <location>  location of output file or folder
    -q, --quiet              dont output anything except errors
    -f, --force              force output to overwrite
    -v, --validate           validate cdn url
```

<a name="api"></a>
## API

You can also use cdnex programmatically.

<a name="api-render"></a>
### .render ({ options })

- Returns a promise resolving with a boolean if an output path is specified, or with the rendered string if no output path is specified.

- `options` An object of render options.
  - `input` Input path of your file(s). Can be a directory or a single file.
  - `src` An input string to parse. Note this is different from `input`, as that is a path to read from, and this is the actual content.
  - `output` Output path for your rendered file(s). If no output is supplied, the result will be sent to the result of the promise.
  - `cdn` The CDN url to use when rendering
  - `validate` `[Default: false]` Whether to make sure CDN url is a valid url.
  - `force` `[Default: false]` Whether to force overwriting any existing files. You will be prompted to overwrite if this is set to `false`.
  - `pattern` `[Default: **/*.{html,css}]` A glob-style pattern of the files to include when searching a directory. Relative to your `input` path.
  - `ignore` A string or array of regex url(s) to ignore when prepending the CDN url. (Note: this is for the urls in your files, not the files themselves. Use `pattern` for that.)
  - `extensions` An array of any extra extensions that extend from the [defaults](#extensions).
  - `onlyExtensions` An array of extensions that will overwrite the [defaults](#extensions).
  - `quiet` `[Default: false]` Whether to hold back from all output except errors.

<a name="api-examples"></a>
### Examples

```javascript
var cdnex = require('cdnex')
/* or using ES6 */
import { render } from 'cdnex'

/* using an input and output directory */
cdnex.render({
  input: 'src',
  output: 'dist',
  cdn: 'https://mycdn.com',
})

/* using a src instead of a path */
cdnex.render({
  src: fs.readFileSync('index.html', 'utf8'),
  output: 'dist/index.html',
  cdn: 'https://mycdn.com',
})

/* if no output is specified, get output in promise result */
cdnex.render({
  src: fs.readFileSync('index.html', 'utf8'),
  cdn: 'https://mycdn.com',
}).then(function(rendered) {
  console.log(rendered)
}).catch(function(err) {
  console.log(err)
})

/* only replace .css and .js files in your HTML */
cdnex.render({
  ...
  pattern: '**/*.html',
  onlyExtensions: ['.css', '.js'],
})

/* add .pdf extension to the default extensions */
cdnex.render({
  ...
  extensions: ['.pdf']
})
```

<a name="extensions"></a>
## Extensions

By default, cdnex will prepend the CDN url to all internal paths with the following extensions: `.html`, `.css`, `.js`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.woff`, `.woff2`, `.eot`, `.ttf`, `.otf`, `.mp4`, `.webm`, `.ogg`, `.mp3`, `.wav`.

<a name="help"></a>
## Testing & Contributing
```bash
npm install
npm test
```

If you want to contribute or come across an issue that you know how to fix, [just do it](https://www.youtube.com/watch?v=ZXsQAXx_ao0).
