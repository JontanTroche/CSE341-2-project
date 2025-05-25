const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello World');});

router.use('/albums', require('./albums'));

module.exports = router;