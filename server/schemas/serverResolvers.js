//this file is for 'resolvers' that are triggered by the server

const { User } = require('../models');
const { getProfile, loggedIn, signToken } = require('../utils/auth');

useHint = async (jwt) => {
	// console.log('server: useHint resolver');
	// console.log(jwt)
	if(!loggedIn(jwt))
		return false;
	const profile = getProfile(jwt).data;
	if (profile.dailyHints === 0)
		return false;
	// console.log(profile);
	const user = await User.findOne({ email: profile.email })
		.select('username email dailyHints');
	// console.log(user);
	// console.log(user.dailyHints);
	if (!user)
		return false;
	if (user.dailyHints === 0)
		return false;
	
	user.dailyHints--;
	
	try {
		await user.save();
	} catch (err) {
		// console.log(err);
		return false;
	}
	
	const token = signToken(user);
	
	return token;
};

module.exports = {
	useHint
};