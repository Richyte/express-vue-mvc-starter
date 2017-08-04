const packageJSON = require('../../../package.json');

module.exports.default = (router) => {
    router.get('/health', (req, res) => {
        const okMessage = {
            result: 'ok',
            version: packageJSON.version
        };
        res.json(okMessage);
    });
};