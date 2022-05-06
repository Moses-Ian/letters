const registerGameHandler = require('./game-handler');

const registerHandlers = (io, socket) => {
	registerGameHandler(io, socket);
}

module.exports = registerHandlers;
