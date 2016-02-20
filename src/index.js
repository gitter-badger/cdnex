
// function run(root, prefix, cb) {
//   readdir(root, function(err, files) {
//     if (err) return cb(err)
//
//     if (prefix.slice(-1) !== '/')
//       prefix += '/'
//
//     _.forEach(files, function(file) {
//       var ext = path.extname(file)
//       if (!ext.match(/\.html|\.css/)) return
//
//       cdnex(prefix, file)
//     })
//
//     cb()
//   })
// }
//
// /**
//  * replace files with cdn urls
//  */
//
// function cdnex(prefix, filename) {
//   return new Promise(function(resolve, reject) {
//     filename = path.resolve(filename)
//
//     var data = fs.readFileSync(filename, 'utf8')
//
//     var extensions = [
//       /* common */
//       'json','css','js','png','jpg','jpeg','gif','svg','pdf','txt', 'less',
//       'woff2','woff','eot','ttf','otf',
//       'mp4', 'webm', 'ogg', 'mov', 'avi', 'flv', 'm4v', 'mpg',
//       /* uncommon */
//       'docx','doc','log','msg','odt','pages','rtf','tex','wpd','wps','csv',
//       'dat','gbr','ged','key','keychain','pps','ppt','pptx','sdf','tar','vcf','xml',
//       'aif','iff','m3u','m4a','mid','mp3','mpa','ra','wav','wma','3g2','3gp','asf',
//       'asx','rm','srt','swf','vob','wmv','3dm',
//       '3ds','max','obj','bmp','dds','sketch','psd','pspimage','tga','thm',
//       'tif','tiff','yuv','ai','eps','ps','indd','pct','xlr','xls','xlsx',
//       'accdb','db','dbf','mdb','pdb','sql','apk','app','bat','cgi','exe',
//       'jar','pif','vb','wsf','dem','gam','nes','rom','sav','dwg','dxf','gpx','kml',
//       'kmz','asp','aspx','cer','cfm','csr','php','rss', 'crx','plugin',
//       'fnt','fon','cab','cpl','cur', 'dll','dmp','drv', 'appcache',
//       'icns','ico','lnk','sys','cfg','ini','prf','hqx','mim','uue',
//       '7z','cbr','deb','gz','pkg','rar','rpm','sitx','tar.gz','zip','zipx','bin','cue',
//       'dmg','iso','mdf','toast','vcd','c','class','cpp','cs','dtd','fla','h','java',
//       'lua','m','pl','py','sh','sln','swift','vcxproj','xcodeproj','bak','tmp','crdownload',
//       'ics','msi','part','torrent'
//     ]
//
//     var regexExts = '(\\.' + extensions.join('|\\.') + ')'
//     var regex = new RegExp('(\\(|\"|\'|\\=)(?!\/_zab_\/)(\\/)?([^\\(\\)\\/,\'\"\\s](?:(?!\\/\\/|<|>|;|:|\\s)[^\"|\'])*)' + regexExts + '(\\?|#|\"|\'|\\)|\\s)', 'ig')
//     var newData = data.replace(regex, '$1' + prefix + '$3$4$5').replace(/\.\.\//g, '')
//
//     fs.writeFileSync(filename, newData, 'utf8')
//
//     resolve(newData)
//   })
// }
//
// /**
//  * test stuff
//  */
//
// // if (filename.match(/index\.html/)) console.log(newData)
//
// // src="/_zab_/img/hi.jpg"
// // data-steller-source="1.0"
// // src="http://img/hi.jpg"
// // style="background-image:url('/img/bg1.jpg')"
// // src="/img/hi.jpg"
// // src="/img/hi1.jpg"
// // src="/img/hi.jpg?hi#hey"
// // src="/img/hi.jpg#hey"
// // src='/img/hi.jpg'
// // src='../img/hi.jpg'
// // src=/img/hi.jpg
// // src="//img/hi.jpg"
// // url("/img/hi.jpg")
// // url('/img/hi.jpg')
// // url(/img/hi.jpg)
// // url(/img/hi.jpg#sup)
// // style="background:url('/img/hi.jpg')"
// // style="background:url('/img/bounce.jpg')"
// // style="background:url(/img/hi.jpg)"
// // var url = "/hi/{{title}}.jpg"
