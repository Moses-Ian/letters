const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { DateTime } = require('luxon');

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
  },
  Mutation: {
		addUser: async (parent, args) => {
			console.log('addUser');
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

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
		}
  }
};

module.exports = resolvers;
