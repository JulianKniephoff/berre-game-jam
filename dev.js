(async () => {
    const Bundler = require('parcel-bundler');

    await new Bundler(
        'server/index.js',
        { target: 'node', outDir: 'dist/server' },
    ).bundle();
    await new Bundler(
        'client/index.html',
        { outDir: 'dist/client' },
    ).bundle();

    const express = require('express');
    const { default: app } = require('./dist/server');
    const reload = require('reload');
    const injector = require('connect-livereload');

    const proxy = express();
    proxy.use(injector({
        src: '/reload/reload.js',
    }));
    proxy.use(app);

    proxy.listen(3001);

    await reload(proxy);
})();
