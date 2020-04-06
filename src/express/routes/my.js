const {Router} = require('express');

myRouter = Router();

myRouter.get('/', (req, res) => res.send(req.originalUrl));
myRouter.get('/comments', (req, res) => res.send(req.originalUrl));

module.exports = myRouter;
