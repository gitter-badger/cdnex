var test = require('tape')
var fs = require('fs-extra')
var path = require('path')
var cdnex = require('../lib')

test('prepend()', function(t) {

  t.test('regex matching for html', function(st) {
    st.plan(21)

    var opts = {
      cdn: 'http://cdn.co',
      onlyExtensions: ['jpg', 'jpg1'],
    }

    cdnex.prepend('<img src="/img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg">',
        'regular')
    })
    cdnex.prepend('<img src="img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg">',
        'no leading slash')
    })
    cdnex.prepend('<img src="../img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg">',
        'dot dot slash')
    })
    cdnex.prepend('<img src="../../img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg">',
        'double dot dot slash')
    })
    cdnex.prepend('<img src="/img/test1.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test1.jpg">',
        'number in filename')
    })
    cdnex.prepend('<img src="/img/test.jpg1">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg1">',
        'number in extension')
    })
    cdnex.prepend('<img src="/img/test.jpg" >', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg" >',
        'space after quote')
    })
    cdnex.prepend('<img src="/img/test.jpg" />', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg" />',
        'xml closing slash')
    })
    cdnex.prepend('<img src="/img/test.jpg" style="border:none;">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg" style="border:none;">',
        'additional rules')
    })
    cdnex.prepend('<img src="http://a.com/img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="http://a.com/img/test.jpg">',
        'dont write to absolute url (http)')
    })
    cdnex.prepend('<img src="https://a.com/img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="https://a.com/img/test.jpg">',
        'dont write to absolute url (https)')
    })
    cdnex.prepend('<img src="//a.com/img/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="//a.com/img/test.jpg">',
        'dont write to absolute url (no protocol)')
    })
    cdnex.prepend('<img data-test="1.0">', opts).then(function(res) {
      st.equal(res, '<img data-test="1.0">',
        'doesnt get confused with decimal')
    })
    cdnex.prepend('<img src="/img/test.png">', opts).then(function(res) {
      st.equal(res, '<img src="/img/test.png">',
        'non-specified extension')
    })
    cdnex.prepend("<img src='/img/test.jpg'>", opts).then(function(res) {
      st.equal(res, "<img src='http://cdn.co/img/test.jpg'>",
        'single quotes')
    })
    cdnex.prepend('<img src=/img/test.jpg>', opts).then(function(res) {
      st.equal(res, '<img src=http://cdn.co/img/test.jpg>',
        'no quotes')
    })
    cdnex.prepend('<img src=/img/test.jpg >', opts).then(function(res) {
      st.equal(res, '<img src=http://cdn.co/img/test.jpg >',
        'no quotes and space after')
    })
    cdnex.prepend('<img src="/img/test.jpg?hi">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg?hi">',
        'query string')
    })
    cdnex.prepend('<img src="/img/test.jpg?hi=hey&hello=world">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg?hi=hey&hello=world">',
        'multiple query strings')
    })
    cdnex.prepend('<img src="/img/test.jpg#hey">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg#hey">',
        'url hash')
    })
    cdnex.prepend('<img src="/img/test.jpg?hi=hey#hello">', opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg?hi=hey#hello">',
        'url hash and query string')
    })
  })

  t.test('regex matching for css', function(st) {
    st.plan(6)

    var opts = {
      cdn: 'http://cdn.co',
      onlyExtensions: ['jpg'],
    }

    cdnex.prepend('url("/img/test.jpg")', opts).then(function(res) {
      st.equal(res, 'url("http://cdn.co/img/test.jpg")',
        'regular')
    })
    cdnex.prepend('url("/img/test.jpg#hey")', opts).then(function(res) {
      st.equal(res, 'url("http://cdn.co/img/test.jpg#hey")',
        'with url hash')
    })
    cdnex.prepend('url("img/test.jpg")', opts).then(function(res) {
      st.equal(res, 'url("http://cdn.co/img/test.jpg")',
        'no leading slash')
    })
    cdnex.prepend("url('/img/test.jpg')", opts).then(function(res) {
      st.equal(res, "url('http://cdn.co/img/test.jpg')",
        'single quotes')
    })
    cdnex.prepend("url(/img/test.jpg)", opts).then(function(res) {
      st.equal(res, "url(http://cdn.co/img/test.jpg)",
        'no quotes')
    })
    cdnex.prepend("url(/img/test.jpg#hey)", opts).then(function(res) {
      st.equal(res, "url(http://cdn.co/img/test.jpg#hey)",
        'no quotes with url hash')
    })
  })

  t.test('regex matching for inline css', function(st) {
    st.plan(7)

    var opts = {
      cdn: 'http://cdn.co',
      onlyExtensions: ['jpg'],
    }

    cdnex.prepend('<div class="test" style="background:url(\'/img/test.jpg\')">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background:url(\'http://cdn.co/img/test.jpg\')">',
        'background url single quotes')
    })
    cdnex.prepend('<div class="test" style="background:url(\"/img/test.jpg\")">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background:url(\"http://cdn.co/img/test.jpg\")">',
        'background url double quotes')
    })
    cdnex.prepend('<div class="test" style="background:url(/img/test.jpg)">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background:url(http://cdn.co/img/test.jpg)">',
        'background url no quotes')
    })
    cdnex.prepend('<div class="test" style="background: url(/img/test.jpg)">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background: url(http://cdn.co/img/test.jpg)">',
        'background url no quotes with space')
    })
    cdnex.prepend('<div class="test" style="background:url(/img/test.jpg);color:white;">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background:url(http://cdn.co/img/test.jpg);color:white;">',
        'background url with other rules')
    })
    cdnex.prepend('<div class="test" style="background-image:url(/img/test.jpg);">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background-image:url(http://cdn.co/img/test.jpg);">',
        'background image url')
    })
    cdnex.prepend('<div class="test" style="background-image: url(/img/test.jpg);">', opts).then(function(res) {
      st.equal(res, '<div class="test" style="background-image: url(http://cdn.co/img/test.jpg);">',
        'background image url with space')
    })
  })

  t.test('added extension', function(st) {
    st.plan(1)

    var opts = {
      cdn: 'http://cdn.co',
      extensions: ['pdf'],
    }

    cdnex.prepend('<a href="test.pdf">', opts).then(function(res) {
      st.equal(res, '<a href="http://cdn.co/test.pdf">',
        'adds single extension')
    })
  })

  t.test('ignored paths', function(st) {
    st.plan(2)

    var opts = {
      cdn: 'http://cdn.co',
      ignore: ['/_cdnex_/', '/_cdnex2_/'],
    }

    cdnex.prepend('<img src="/_cdnex_/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="/_cdnex_/test.jpg">',
        'respects ignored paths')
    })
    cdnex.prepend('<img src="/_cdnex2_/test.jpg">', opts).then(function(res) {
      st.equal(res, '<img src="/_cdnex2_/test.jpg">',
        'respects ignored paths (2)')
    })
  })

  t.test('reads in file', function(st) {
    st.plan(1)

    var opts = {
      cdn: 'http://cdn.co',
    }

    var file = __dirname + '/tmp.html'
    fs.writeFileSync(file, '<img src="/img/test.jpg">')

    cdnex.prepend(file, opts).then(function(res) {
      st.equal(res, '<img src="http://cdn.co/img/test.jpg">',
        'reads html file')
      fs.removeSync(file)
    })
  })

})

test('render()', function(t) {

  t.test('exceptions', function(st) {
    st.throws(
      cdnex.render(),
      'catches no cdn url')
    st.throws(
      cdnex.render({
        cdn: 'hey',
        validate: true,
      }),
      'catches invalid url')
    st.throws(
      cdnex.render({
        cdn: 'http://cdn.co',
        input: ''
      }),
      'no input provided')
    st.throws(
      cdnex.render({
        cdn: 'http://cdn.co',
        input: 'index.html',
        src: '<html></html>',
      }),
      'input and src both specified')
    st.throws(
      cdnex.render({
        cdn: 'http://cdn.co',
        input: 'index.html',
      }),
      'input file doesnt exist')
    fs.writeFileSync('test.html', '')
    st.throws(
      cdnex.render({
        cdn: 'http://cdn.co',
        src: '',
        output: 'index.html',
        force: false,
      }),
      'doesnt overwrite when not forced')
    fs.removeSync('test.html')
    st.end()
  })

  t.test('input/output file', function(st) {
    var file = __dirname + '/tmp.html'
    var outputFile = __dirname + '/tmp.new.html'
    var html = '<html><body><img src="/img/test.jpg"></body></html>'
    fs.writeFileSync(file, html)

    cdnex.render({
      cdn: 'http://cdn.co',
      input: file,
      output: outputFile,
      quiet: true,
    }).then(function() {
      st.equal(
        fs.readFileSync(outputFile, 'utf8'),
        '<html><body><img src="http://cdn.co/img/test.jpg"></body></html>',
        'wrote to output file')
      fs.removeSync(file)
      fs.removeSync(outputFile)
      st.end()
    }).catch(st.error)
  })

  t.test('input/output directory', function(st) {
    var dirSrc = __dirname + '/tmp/src'
    var dirDist = __dirname + '/tmp/dist'

    var html = '<html><body><img src="/img/test.jpg"></body></html>'
    var css = 'body { background: url("/img/test.jpg") }'

    fs.removeSync(dirSrc)
    fs.ensureDirSync(dirSrc)

    fs.writeFileSync(dirSrc + '/tmp.html', html)
    fs.writeFileSync(dirSrc + '/tmp.css', css)

    cdnex.render({
      cdn: 'http://cdn.co',
      input: dirSrc,
      output: dirDist,
      quiet: true,
      force: true,
      // pattern: '**/*.{html.css}',
    }).then(function() {
      st.equal(
        fs.readFileSync(dirDist + '/tmp.html', 'utf8'),
        '<html><body><img src="http://cdn.co/img/test.jpg"></body></html>',
        'wrote to output html file')
      st.equal(
        fs.readFileSync(dirDist + '/tmp.css', 'utf8'),
        'body { background: url("http://cdn.co/img/test.jpg") }',
        'wrote to output css file')
      st.throws(
        cdnex.render({
          cdn: 'http://cdn.co',
          input: dirSrc,
          output: dirDist,
          force: false,
          quiet: true,
        }),
        'stops if not overwriting')
      fs.removeSync(path.dirname(dirSrc))
      st.end()
    }).catch(st.error)
  })

  t.test('output to string', function(st) {
    cdnex.render({
      cdn: 'http://cdn.co',
      src: '<html><body><img src="/img/test.jpg"></body></html>',
    }).then(function(rendered) {
      st.equal(
        rendered,
        '<html><body><img src="http://cdn.co/img/test.jpg"></body></html>',
        'output rendered string rather than file')
      st.end()
    }).catch(st.error)
  })


})
