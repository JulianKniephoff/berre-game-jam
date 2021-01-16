const { default: app } = require('./dist/server');
const Bundler = require('parcel-bundler');

app.use(new Bundler('client/index.html', { hmrPort: 3001 }).middleware());
