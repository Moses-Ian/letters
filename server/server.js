const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require('./utils/helpers');
const mongoose = require('./config/connection');
const session = require('express-session');
const registerHandlers = require('./handlers');
require('dotenv').config({path:'../.env'});

const app = express();
const PORT = process.env.PORT || 3001;

//socket.io stuff
const server = require('http').createServer(app);
// const io = require('socket.io')(server);	//deployed
const io = require('socket.io')(server, {	//development
	cors: {
		origin: ['http://localhost:3000']
	}
});
io.on('connection', (socket) => registerHandlers(io, socket));

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

server.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
});