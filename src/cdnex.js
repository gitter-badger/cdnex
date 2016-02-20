/**
 * dependencies
 */

import dn from 'denodeify'
import glob from 'glob'
import path from 'path'
import fs from 'fs-promise'
import validator from 'validator'
import inquirer from 'inquirer'
import chalk from 'chalk'

/**
 * render cdnex
 */

export async function render (options = {}) {
  try {
    if (!options.cdn) {
      throw new Error('no cdn url was specified')
    }

    if (options.validate && !validator.isURL(options.cdn)) {
      throw new Error(`${options.cdn} is not a valid domain name`)
    }

    var input
    if (!options.src) {
      /* input is a file/dirname, read from disk */
      input = options.input || options.args[0] || undefined
      let exists = await fs.exists(input)

      if (!input) throw new Error('no input file or directory was specified')
      if (!exists) throw new Error(`"${input}" does not exist`)

      /* is this a dir? */
      let stats = await fs.lstat(input)
      var isDir = stats.isDirectory()
    } else {
      /* input data was passed through directly, no need to read from disk */
      input = options.src
    }

    var cdnexed
    if (isDir) {
      let files = await dn(glob)(path.resolve(input) + '/**/*.{html,css}')

      cdnexed = await Promise.all(files.map(async file => {
        try {
          cdnexed = await prepend(file, options)
          return { file, cdnexed }
        } catch (err) {
          return Promise.reject(err)
        }
      }))
    } else {
      cdnexed = await prepend(input, options)
    }

    if (options.output) {
      /* warn if overwriting */
      var outputExists = await fs.exists(options.output)
      if (outputExists && !options.force) {
        /* ask if they want to overwrite */
        const { overwrite } = await dn(inquirer.prompt, a => [null, a])([{
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow(`${options.output} already exists. overwrite?`),
        }])

        /* abort if they dont */
        if (!overwrite) {
          console.log(chalk.red('please change your output and try again'))
          process.exit(1)
        }
      }

      /* output to file(s) */
      if (typeof cdnexed === 'object') {
        /* make sure output directory exists */
        await fs.ensureDir(options.output)

        await Promise.all(cdnexed.map(obj => {
          /* generate output folder in filename */
          obj.output = obj.file.replace(input, options.output)

          /* output paths without cwd */
          if (!options.quiet) {
            console.log('rendering',
              obj.file.replace(process.cwd() + '/', ''), 'to',
              obj.output.replace(process.cwd() + '/', '')
            )
          }

          return fs.writeFile(obj.output, obj.cdnexed)
        }))
      } else {
        /* output to a single file */
        if (!options.quiet) {
          console.log(`rendering ${input} to ${options.output}`)
        }

        await fs.writeFile(options.output, cdnexed)
      }

      return true
    } else {
      /* no output, just return it */
      return cdnexed
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * prepend url to file
 */

export function prepend (content, options = {}) {
  /* add trailing slash */
  if (options.cdn.slice(-1) !== '/') options.cdn += '/'

  /* read file if filename was passed as content */
  var promise
  if (path.extname(content)) {
    promise = fs.readFile(content, 'utf8')
  } else {
    promise = Promise.resolve(content)
  }

  options.onlyExtensions = (options.onlyExtensions || [
    'html', 'css',
    'png', 'jpe?g', 'gif', 'svg',
    'woff2?', 'eot', 'ttf', 'otf',
    'mp4', 'webm', 'ogg',
    'mp3', 'wav',
  ]).concat(options.extensions || [])

  options.ignore = options.ignore || ''

  return promise.then(data => {
    /* remove leading dot if it exists */
    options.onlyExtensions = options.onlyExtensions.map(ext => {
      if (ext.charAt(0) === '.') return ext.substring(1)
      else return ext
    })

    let extensionsRegex = `(\\.${options.onlyExtensions.join('|\\.')})`

    if (options.ignore instanceof Array) {
      options.ignore = options.ignore.join('|')
    }

    let ignoreRegex = options.ignore ? `(?!${options.ignore})` : ''

    let regex = new RegExp(
      '(\\(|\"|\'|\\=)'
      + ignoreRegex
      + '(\\/)?([^\\(\\)\\/,\'\"\\s](?:(?!\\/\\/|<|>|;|:|\\s)[^\"|\'])*)'
      + extensionsRegex
      + '(\\?|#|\"|\'|\\)|\\s)',
      'ig'
    )

    return data
      .replace(regex, `$1${options.cdn}$3$4$5`)
      .replace(/\.\.\//g, '')
  })
}
