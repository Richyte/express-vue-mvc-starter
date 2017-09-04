// 
const express = require('express');
const bodyParser = require('body-parser');

const setupRouter = function () {
    const bodyParserEncoder = bodyParser.urlencoded({
        extended: false
    });
    const router = express.Router();

    //Oauth2
    router.get('/hello', (req, res) => {
        res.json({
            body: req.body
        });
    });

    router.post('/postexample', bodyParserEncoder, (req, res) => {
        res.json({
            body: req.body
        });
    });

    return router;
};

module.exports.init = setupRouter;
exports.default = setupRouter;