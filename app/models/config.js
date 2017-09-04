// 
const path = require('path');

class Config {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.root = path.normalize(__dirname + '/..');
        this.rootPath = process.env.ROOT_PATH || '/';
        this.app = {
            name: 'Express-Vue-MVC-Starter'
        };
        this.port = parseInt(process.env.PORT) || 9000;
    }
}
module.exports = Config;