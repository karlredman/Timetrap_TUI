var readdirp = require('readdirp')
  , path = require('path')
  , es = require('event-stream');

// print out all JavaScript files along with their size

var stream = readdirp({ root: path.join(__dirname), fileFilter: '*.js' });
stream
  .on('warn', function (err) {
    console.error('non-fatal error', err);
    // optionally call stream.destroy() here in order to abort and cause 'close' to be emitted
  })
  .on('error', function (err) { console.error('fatal error', err); })
  .pipe(es.mapSync(function (entry) {
    return { path: entry.path, name: entry.name, };
  }))
  .pipe(es.stringify())
  .pipe(process.stdout);
