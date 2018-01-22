const app = require('../app');

let server;

before((done) => {
  server = app.listen(4000, done);
});

it('conforms to standard', require('mocha-standard/semistandard'));

after((done) => {
  server.close(done);
});
