const { AuthenticationError } = require('apollo-server-express');
const sendgridMail = require('@sendgrid/mail');
const { User } = require('../models');
const { sanitize, validateEmail } = require('../utils/helpers');
const { signToken } = require('../utils/auth');
const { DateTime } = require('luxon');
const webPush = require('web-push');

const developerEmails = [
	'ian@hotmail.com'
];
const TWENTY_MINUTES = 1000 * 60 * 20;
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const resolvers = {
  Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id })
					.select('-__v -password')
					.populate('friends');
				return userData;
			}

			throw new AuthenticationError('Not logged in');
		},
		// get all users
		users: async () => {
			return User.find()
				.select('-__v -password')
				.populate('friends')
		},
		// get a user by username
		user: async (parent, { username }) => {
			return User.findOne({ username })
				.select('-__v -password')
				.populate('friends')
		},
		// get VAPID Public Key
		VAPIDPublicKey: () => {
			return { VAPIDPublicKey: process.env.VAPID_PUBLIC_KEY}
		},
		// get word of the day
		wordOfTheDay: () => {
			return WORD_OF_THE_DAY;
		}
  },
  Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { email, password }) => {
			console.log('login');
			const user = await User.findOne({ email });
			if (!user) throw new AuthenticationError('Incorrect credentials');

			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) throw new AuthenticationError('Incorrect credentials');

			try {
				const now = DateTime.now();
				const then = DateTime.fromJSDate(user.lastLogin);
				if(!now.hasSame(then, 'day'))
					user.dailyHints = 3;
				user.lastLogin = now;
				await user.save();
			} catch (err) {
				console.error(err);
			}

			const token = signToken(user);
			return { token, user };
		},
		extend: async (parent, args, context) => {
			if (!context.user) throw new AuthenticationError('You need to be logged in!');
			
			const user = await User.findOne({ email: context.user.email });
			if (!user) throw new AuthenticationError('Incorrect credentials');

			try {
				const now = DateTime.now();
				const then = DateTime.fromJSDate(user.lastLogin);
				if(!now.hasSame(then, 'day'))
					user.dailyHints = 3;
				user.lastLogin = now;
				await user.save();
			} catch (err) {
				console.error(err);
			}

			const token = signToken(user);
			return { token };
		},
		addFriend: async (parent, { friendId }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { friends: friendId } },
					{ new: true }
				).populate('friends');

				return updatedUser;
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		addFriendByUsername: async (parent, { username }, context) => {
			if (context.user) {
				const friend = await User.findOne({username})
					.select('_id');
				if (!friend)
					throw new Error(`No user named ${username}!`);
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { friends: friend._id } },
					{ new: true }
				).populate('friends');

				return updatedUser;
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		addHints: async (parent, {email, dailyHints}) => {
			if (!developerEmails.includes(email)) {
				console.error(`${email} tried to give themselves ${dailyHints} hints!!!`);
				return null;
			}
			const user = await User.findOneAndUpdate(
				{ email },
				{ dailyHints },
				{ new: true }
			);
			return user;
		},
		sendEmail: async (_, args, context) => {
			const message = {
				to: 'infestedian@gmail.com',
				from: 'epsilon.studios@l3tters.com',
				subject: 'email from contact form',
				text: `email from ${args.input.from}, message - ${args.input.message}`
			};
			
			try {
				const email = await sendgridMail.send(message)
				return {
					success: true,
					message: 'Successfully sent email',
					error: null
				};
			} catch(err) {
				return {
					success: false,
					message: null,
					error: err
				};
			}
		},
		shareLobbyByEmail: async (parent, args, context) => {
			try {
				//verify user
				if (!context.user) throw new AuthenticationError('You need to be logged in!');
				
				//build the message
				const {room, to} = args;
				
				if (sanitize(room) === '')
					throw `Invalid room name`;
				
				const personalizations = to.map(email => {
					//validate inputs -> we do this in both the client and here
					if (!validateEmail(email))
						throw `Invalid email - ${email}`;
					return {to: email}
				});
				const url = process.env.NODE_ENV === 'production' 
					? `www.l3tters.com/join?room=${room}` 
					: `localhost:3000/join?room=${room}`;
				const message = {
					personalizations,
					from: 'epsilon.studios@l3tters.com',
					subject: 'Join a game on L3tters.com!',
					text: `Click the link to join your friend in a game of L3tters! ${url}`
				}
			
				//send email
				const email = await sendgridMail.send(message);
				return {
					success: true,
					message: 'Successfully sent email',
					error: null
				}
			} catch(err) {
				console.error(err);
				return {
					success: false,
					message: null,
					error: err
				};
			}
		},
		registerPushSubscription: async (parent, args, context) => {
			try {
				//verify user
				if (!context.user) throw new AuthenticationError('You need to be logged in!');
				
				//save the subscription to the user's data
				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ subscription: args.subscription },
					{ new: true }
				);
			
				return null;
			} catch (err) {
				console.error(err);
				return null;
			}
		},
		sendNotification: async (parent, args, context) => {
			try {
				//verify user
				if (!context.user) throw new AuthenticationError('You need to be logged in!');
				
				// get my list of friends
				// -> with their subscription details
				const me = await User.find({username: context.user.username})
					.populate({
						path: 'friends', 
						select: 'username subscription',
						match: {$and: [
							{ username: { $ne: context.user.username } },
							{ username: { $in: args.input.friends  } },
							{ subscription: { $exists: true      } }] }
					});
					// could also check that expiration time is valid

				// send the push
				const options = { TTL: TWENTY_MINUTES	};
				me[0].friends.forEach(user => {
					const subscription = user.subscription;
					const payload = `Join ${context.user.username} in a game of L3tters!
${context.headers.referer}join?room=${args.input.room}`;
					webPush.sendNotification(subscription, payload, options)
						.catch(error => {
							console.log('this one right here, sir');
							console.log(user.username);
							console.error(error);
						});
				});
				
				return null;
			} catch (err) {
				console.error(err);
				return null;
			}
		}
  }
};

module.exports = resolvers;
