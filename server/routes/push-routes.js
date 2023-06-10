/* =============================================

The routes in here are available in both REST and GraphQL
The idea is that fetch requests are easier outside of React,
but the default queries are best in React.
Since these two routes are performed by register-service-worker.js,
which uses fetch, it should query these two routes.
On the other hand, sendNotification is performed by Share/index.jsx,
which uses React, so that route is in resolvers.

============================================= */

const router = require('express').Router();
const {authMiddleware} = require('../utils/auth');
const { User } = require('../models');

// service-worker requests the VAPID key
router.get('/vapidPublicKey', (req, res) => {
	res.send(process.env.VAPID_PUBLIC_KEY);
});

// service-worker subscribes to push notifications
router.post('/registerPushSubscription', async (req, res) => {
	//I'm going to cheat to insert middleware
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

module.exports = router;