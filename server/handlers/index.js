const registerGameHandler = require('./game-handler');
const registerCatHandler = require('./chat-handler');

const registerHandlers = (io, socket) => {
	registerGameHandler(io, socket);
	registerCatHandler(io, socket);
}

module.exports = registerHandlers;
