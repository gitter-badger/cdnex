var test = require('tape')

test('cdnex', function(t) {

  t.end()
})

// src="/_zab_/img/hi.jpg"
// data-steller-source="1.0"
// src="http://img/hi.jpg"
// style="background-image:url('/img/bg1.jpg')"
// src="/img/hi.jpg"
// src="/img/hi1.jpg"
// src="/img/hi.jpg?hi#hey"
// src="/img/hi.jpg#hey"
// src='/img/hi.jpg'
// src='../img/hi.jpg'
// src=/img/hi.jpg
// src="//img/hi.jpg"
// url("/img/hi.jpg")
// url('/img/hi.jpg')
// url(/img/hi.jpg)
// url(/img/hi.jpg#sup)
// style="background:url('/img/hi.jpg')"
// style="background:url('/img/bounce.jpg')"
// style="background:url(/img/hi.jpg)"
// var url = "/hi/{{title}}.jpg"
