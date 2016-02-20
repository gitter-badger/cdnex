var test = require('tape')
var fs = require('fs-promise')
var cdnex = require('../lib')

test('cdnex', function(t) {

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
