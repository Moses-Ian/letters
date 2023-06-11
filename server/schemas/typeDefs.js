// import the gql tagged template function
const { gql } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');

// create a Date definition
// https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

// create our typeDefs
const typeDefs = gql`
	scalar Date

	type Query {
		me: User
		users: [User]
		user(username: String!): User
		VAPIDPublicKey: VAPIDPublicKey
		wordOfTheDay: String
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		extend: Auth
		addUser(username: String!, email: String!, password: String!): Auth
		addFriend(friendId: ID!): User
		addFriendByUsername(username: String!): User
		requestFriendByUsername(username: String!): User
		addHints(email: String!, dailyHints: Int!): User
		sendEmail(input: EmailInput!): Response!
		shareLobbyByEmail(room: String!, to: [String]): Response!
		sendFeedback(input: FeedbackInput!): Response!
		registerPushSubscription(subscription: SubscriptionInput!): Void
		sendNotification(input: NotificationInput!): Void
	}
	
	input SubscriptionInput {
		endpoint: String!
		expirationTime: Date
		keys: Keys!
	}
	
	input Keys {
		p256dh: String!
		auth: String!
	}
	
	input NotificationInput {
		room: String!
		friends: [String]!
	}
	
	input EmailInput {
		message: String!
		from: String!
	}
	
	input FeedbackInput {
		feedbackType: String
		comment: String
		doesDo: String
		email: String
		extra: String
		how: String
		makeHappen: String
		screenshots: String
		shouldDo: String
		whatIsFeature: String
		whatIsFunctionality: String
		whyFeature: String
		whyFunctionality: String
	}
	
	type User {
		_id: ID
		username: String
		email: String
		friendCount: Int
		lastLogin: Date
		dailyHints: Int
		friends: [User]
	}
	
	type VAPIDPublicKey {
		VAPIDPublicKey: String
	}
	
	type Auth {
		token: ID!
		user: User
	}
	
	type Email {
		message: String
		from: String
	}
	
	type Response {
		success: Boolean
		message: String
		error: String
	}
	
	type Void {
		void: String
	}

`;

// export the typeDefs
module.exports = typeDefs;
