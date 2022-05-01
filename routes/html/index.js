const router = require('express').Router();

router.use('/', require('./home-routes.js'));

module.exports = router;