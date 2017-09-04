// 
const express = require('express');
const glob = require('glob');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const csrf = require('csurf');
const validator = require('express-validator');
const expressVue = require('express-vue');
const oauth2Api = require('./api');
const path = require('path');

module.exports.init = (app, config) => {
    //Setup
    const env = process.env.NODE_ENV || 'development';
    const router = express.Router();
    let logType = 'dev';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = (env === 'development');
    app.locals.rootPath = process.env.ROOT_PATH;

    //ExpressVue Setup
    //Latest non-production version of vue as of writing this doc, 
    //you can go to https://unpkg.com/vue/ to find the latest version
    //check the vuejs.org docs for more info
    let vueScript = 'https://unpkg.com/vue@2.4.2/dist/vue.js';

    if (process.env.NODE_ENV === 'production') {
        //its production so use the minimised production build of vuejs
        vueScript = 'https://unpkg.com/vue';
    }

    const vueOptions = {
        rootPath: path.join(__dirname, 'routes'),
        vue: {
            head: {
                meta: [{
                    script: vueScript
                }, {
                    style: 'assets/rendered/style.css'
                }]
            }
        }
    };
    const expressVueMiddleware = expressVue.init(vueOptions);
    app.use(expressVueMiddleware);

    //Security
    app.use(helmet());
    app.disable('x-powered-by');

    //Api
    const oauth2 = oauth2Api.init();
    app.use('/oauth2', oauth2);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(validator());

    let sessionConfig = {
        secret: 'CHANGE_ME_TOKEN',
        name: 'session',
        keys: [
            'CHANGE_ME',
            'ME_TOO_PLEASE'
        ],
        resave: true,
        saveUninitialized: true,
        cookie: {
            domain: 'foo.bar.com',
            secure: false,
            httpOnly: true,
        }
    };
    if (env === 'production') {
        app.set('trust proxy', 1);
        sessionConfig.cookie.secure = true;
        logType = 'combined';
    }

    if (env === 'development') {
        app.use(logger(logType));
    }

    app.use(cookieParser());

    app.use(methodOverride());

    app.use(cookieSession(sessionConfig));

    app.use(csrf({
        cookie: true
    }));

    app.use(function (req, res, next) {
        res.cookie('token', req.csrfToken(), {
            path: '/'
        });
        next();
    });

    app.use(compress());

    app.use(app.locals.rootPath, express.static(config.root));
    app.use('/', router);

    let controllers = glob.sync(config.root + '/routes/**/*.js');
    controllers.forEach(function (controller) {
        module.require(controller).default(router);
    });

    app.use((req, res) => {
        const data = {
            title: 'Error 404'
        };
        const vueOptions = {
            head: {
                title: 'Error 404'
            }
        };
        res.statusCode = 404;
        res.renderVue('error', data, vueOptions);
    });

    app.use(function onError(error, req, res, next) {
        res.statusCode = 500;
        if (res.statusCode) {
            res.renderVue('error', {});
        } else {
            next();
        }
    });

};