const router = require('express').Router();
const {authMiddleware} = require('../utils/auth');
const { User } = require('../models');
const webPush = require('web-push');

const TWENTY_MINUTES = 1000 * 60 * 20;

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
router.post('/sendNotification', async (req, res) => {
	//I'm going to cheat to insert middleware
	console.log('\nsend notification\n');
	req = authMiddleware({req});
	if (!req.user) {
		res.statusMessage = 'Unauthorized - Must be logged in to invite friends to game';
		res.sendStatus(401);
		return;
	}
	if (!req.body.room || !req.body.friends || req.body.friends.length === 0) {
		// bad request
	}
		
	
	// console.log(req.headers.referer);
	// console.log(req.user);
	console.log(req.body);
	
	// get my list of friends
	// -> with their subscription details
	
	// for now, just find me
	const me = await User.find({username: req.user.username})
		.populate({
			path: 'friends', 
			select: 'username subscription',
			match: {$and: [
				{ username: { $ne: req.user.username } },
				{ username: { $in: req.body.friends  } },
				{ subscription: { $exists: true      } }] }
		});
		// could also check that expiration time is valid
	console.log(me[0].friends);
	
	
	// filter the body down to only people in my friends list
	// const users = req.body.friends.filter(friend => 
	
	// send the push
	// users.forEach(user => {
		// const subscription = user.subscription;
		// const payload = `Join ${req.user.username} in a game of L3tters!
// ${req.headers.referer}join?room=${req.body.room}`;
		// const options = { TTL: TWENTY_MINUTES	};
		// webPush.sendNotification(subscription, payload, options)
			// .catch(error => {
				// console.error(error);
			// });
	// });

	res.sendStatus(201);
	
	
	

	// would we need the subscriptions of every user they invited?
	// is payload the invitation message/link?
});


module.exports = router;