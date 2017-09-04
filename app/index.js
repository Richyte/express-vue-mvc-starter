// 
const express = require('express');
const config = require('./config');
const Router = require('./router');
const cluster = require('cluster');
const os = require('os');

let app = express();

Router.init(app, config);

if (cluster.isMaster && config.env !== 'development') {
    let workers = [];
    for (var i = 0; i < os.cpus().length; i++) {
        workers[i] = cluster.fork();
        workers[i].on('exit', (code, signal) => {
            if (signal) {
                console.error(`worker was killed by signal: ${signal}`);
            } else if (code !== 0) {
                console.error(`worker exited with error code: ${code}`);
            } else {
                console.error('worker exited');
            }
        });
    }
} else {
    app.listen(config.port, () => {
        console.warn(`Worker ${process.pid} running a ${config.env} server listening on port ${config.port}`);
    });
}