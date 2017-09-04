// 
const dotenv = require('dotenv');
const Models = require('./models');

let envFile = 'development.env';
const env = process.env.NODE_ENV || 'development';

if (process.env.ENV !== undefined) {
    envFile = env + '.env';
}

dotenv.config({
    path: 'environment/' + envFile
});

const config = new Models.Config();

module.exports = config;