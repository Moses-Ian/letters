const registerChatHandler = (io, socket) => {
	socket.on('send-message', (message, username, room) => {
		console.log(`got ${message}`);
		if (room === '')
			socket.broadcast.emit('receive-message', message);
		else
			socket.to(room).emit('receive-message', username, message);
	});
	// socket.on('join-room', (room, callback) => {
		// socket.join(room);
////		callback(`Joined ${room}`);	// the chat used this
		// callback(true, room);
	// });
}

module.exports = registerChatHandler;