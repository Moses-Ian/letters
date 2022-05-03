const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require('./utils/helpers');
const mongoose = require('./config/connection');
const session = require('express-session');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3001;

//logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
		new winston.transports.Console()
  ],
});


//socket.io stuff
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log(socket.id);
	logger.info(socket.id);
	socket.on('send-message', (message, room) => {
		if (room === '')
			socket.broadcast.emit('receive-message', message);
		else
			socket.to(room).emit('receive-message', message);
	});
	socket.on('join-room', (room, callback) => {
		socket.join(room);
		callback(`Joined ${room}`);
	});
});

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
	logger.info(`Server running on port ${PORT}`); 
});