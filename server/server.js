console.log(process.env.NODE_ENV);

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const routes = require('./routes');
const path = require('path');
const helpers = require('./utils/helpers');
const db = require('./config/connection');
const session = require('express-session');
const registerHandlers = require('./handlers');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

console.log(process.env.NODE_ENV);

// show memory usage
// if (process.env.NODE_ENV === 'development') {
	// setInterval(() => {
		// console.log('===================================');
		// for (const [key,value] of Object.entries(process.memoryUsage())){
			// console.log(`Memory usage by ${key}, ${value/1000000}MB `)
		// }
		// }, 10000
	// );
// }

const app = express();
const PORT = process.env.PORT || 3001;

//apollo stuff
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
apolloServer.applyMiddleware({ app });


//socket.io stuff
const server = require('http').createServer(app);	

console.log(process.env.NODE_ENV);
const coorsPolicy = process.env.NODE_ENV == 'development' ? 
	{
		cors: {
			origin: ['http://localhost:3000']
		}
	} : {};
const io = require('socket.io')(server, coorsPolicy)
io.on('connection', (socket) => registerHandlers(io, socket));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.use(routes);

server.listen(PORT, () => { 
	console.log(`Server running on port ${PORT}`); 
	console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
});