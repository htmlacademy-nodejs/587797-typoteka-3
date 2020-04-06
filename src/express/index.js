const express = require('express');

const articlesRouter = require('./routes/articles');
const myRouter = require('./routes/my');

const PORT = 8080;

const app = express();

app.use('/articles', articlesRouter);
app.use('/my', myRouter);

app.get('/', (req, res) => res.send(req.originalUrl));
app.get('/register', (req, res) => res.send(req.originalUrl));
app.get('/login', (req, res) => res.send(req.originalUrl));
app.get('/search', (req, res) => res.send(req.originalUrl));
app.get('/categories', (req, res) => res.send(req.originalUrl));

app.listen(PORT);
