const router = require('express').Router();

// service-worker requests the VAPID key
router.get('/vapidPublicKey', (req, res) => {
	console.log('vapidPublicKey');
	console.log(process.env.VAPID_PUBLIC_KEY);
	res.send(process.env.VAPID_PUBLIC_KEY);
});

// service-worker subscribes to push notifications
router.post('/register', (req, res) => {
	// A real world application would store the subscription info.
	
	//do something
	console.log('register');
	
	res.sendStatus(201);
});

// the invite-friends button was clicked
router.post('/sendNotification', (req, res) => {
	console.log('send notification');
	res.sendStatus(201);
	
	
	
	// const subscription = req.body.subscription;
	// const payload = req.body.payload;
	// const options = {
		// TTL: req.body.ttl
	// };

	// would we need the subscriptions of every user they invited?
	// is payload the invitation message/link?
	// setTimeout(() => {
		// webPush.sendNotification(subscription, payload, options)
			// .then(() => {
				// res.sendStatus(201);
			// })
			// .catch(error => {
				// console.log(error);
				// res.sendStatus(500);
			// });
	// }, req.body.delay * 1000);	//i think delay is just for the demo?
});


module.exports = router;