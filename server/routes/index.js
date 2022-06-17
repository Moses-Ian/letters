const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

router.use((req, res) => 
	res.status(404).send('<h1>404 Error!</h1>'));

module.exports = router;