// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

	type User {
		_id: ID
		username: String
		email: String
		friendCount: Int
		friends: [User]
	}

	type Query {
		me: User
		users: [User]
		user(username: String!): User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		addFriend(friendId: ID!): User
	}
	
	type Auth {
		token: ID!
		user: User
	}
	
`;

// export the typeDefs
module.exports = typeDefs;
