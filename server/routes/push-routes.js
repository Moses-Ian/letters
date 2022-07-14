const router = require('express').Router();
const {authMiddleware} = require('../utils/auth');
const { User } = require('../models');

// service-worker requests the VAPID key
router.get('/vapidPublicKey', (req, res) => {
	console.log('vapidPublicKey');
	// console.log(process.env.VAPID_PUBLIC_KEY);
	res.send(process.env.VAPID_PUBLIC_KEY);
});

// service-worker subscribes to push notifications
router.post('/register', async (req, res) => {
	//I'm going to cheat to insert middleware
	console.log('\nregister\n');
	req = authMiddleware({req});
	const {subscription} = req.body;
	if (!req.user) {
		res.statusMessage = 'Unauthorized - Must be logged in to register push notification subscription';
		res.sendStatus(401);
		return;
	}

	//save the subscription to the user's data
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.user._id },
			{ subscription },
			{ new: true }
		);
		res.sendStatus(201);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
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