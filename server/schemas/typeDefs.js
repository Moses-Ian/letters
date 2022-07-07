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

	type User {
		_id: ID
		username: String
		email: String
		friendCount: Int
		lastLogin: Date
		dailyHints: Int
		friends: [User]
	}

	type Query {
		me: User
		users: [User]
		user(username: String!): User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		extend: Auth
		addUser(username: String!, email: String!, password: String!): Auth
		addFriend(friendId: ID!): User
		addHints(email: String!, dailyHints: Int!): User
		sendEmail(input: EmailInput!): Response!
		shareLobbyByEmail(room: String!, to: [String]): Response!
	}
	
	type Auth {
		token: ID!
		user: User
	}
	
	type Email {
		message: String
		from: String
	}
	
	input EmailInput {
		message: String!
		from: String!
	}
	
	type Response {
		success: Boolean
		message: String
		error: String
	}
	
`;

// export the typeDefs
module.exports = typeDefs;
