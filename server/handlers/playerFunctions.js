const Game = require("../utils/GameObj.js");
const PlayerObj = require("../utils/PlayerObj.js");

updateScores = (room) => {
  let g = rooms.get(room);
  if (!g) return;
	let submissions = [];
	g.players.forEach(player => {
		if (player.submission.score) {
			player.score += player.submission.score;
			submissions.push(player.submission);
			player.submission = {};
		} else 
			// send an empty object to prevent react from bitching
			submissions.push({});
	});
  io.to(g.name).emit("send-submissions", submissions);
  setTimeout(() => io.to(g.name).emit("send-players", g.getPlayers(), g.turn), 100);
};

nextRound = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.nextTurn();
	io.to(g.name).emit('new-round', g.round, g.players[turn].username);
	g.gameTimer.interrupt(NEXT_ROUND);
};

listRooms = (cb) => {
	const iter = rooms.values();
	let result = iter.next();
	let roomList = [];
	while (!result.done) {
		if (result.value.visible) {
			// pull out the properties I want to show
			const { name } = result.value;
			//push those into the array I will send the client
			roomList.push({ name });
		}
		result = iter.next();
	}
	cb(roomList);
}

updateUsername = (socket, room, username) => {
	console.log('update username', room, username);
	let g = rooms.get(room);
	if (!g) return;
	let player = g.updatePlayerUsername(socket.id, username);
	if (player.username !== username)
		setTimeout(
			() => io.to(socket.id).emit("update-username", player.username),
			2000
		);
  setTimeout(() => io.to(g.name).emit("send-players", g.getPlayers(), g.turn), 1500);
};

joinRoom = (socket, room, oldRoom, username, callback) => {
  //get the rooms
  let g = rooms.get(room);
  if (!g) {
    g = new Game(room); //create the room
    rooms.set(room, g);
  }
  //join the rooms
  socket.join(g.name);
  //add the players
	const player = new PlayerObj(username, socket.id);
  let turn = g.add(player);
  //leave the old room
  leaveRoom(socket, oldRoom);
  //send it back to client
  callback(true, room, player === g.players[turn], g.round, player.username);
  setTimeout(
    // () => io.to(g.name).emit('set-lobby', g.round, g.getPlayers(), g.turn),
    () => io.to(g.name).emit('send-players', g.getPlayers(), g.turn),
    1000
  );
};

leaveRoom = (socket, room, cb = ()=>{}) => {
	if (room === '') return;
  let g = rooms.get(room);
  if (!g) return;
  socket.leave(g.name);
  let turn = g.remove(socket.id);
	cb();
  if (g.players.length == 0) {
    rooms.delete(room);
    return;
  }
  tellTurn(g, turn);
};

tellTurn = (g, turn) => {
  let player = g.players[turn];
  setTimeout(() => io.to(player.id).emit("your-turn"), 1000);
};

getRealUsernames = (room, cb) => {
	let g = rooms.get(room);
	if (!g) {
		cb([]);
		return;
	}
	let usernames = g.players.filter(player => player.realUsername !== 'Guest').map(player => player.realUsername);
	cb(usernames);
}

restartGame = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.restart();
  tellTurn(g, turn);
	io.to(g.name).emit('new-round', g.round, g.getPlayers(), g.turn);
  io.to(g.name).emit("clear-letters");	// we need to update how the reset works
};

disconnect = (socket, reason) => {
  console.log(`disconnect:  ${socket.id}`);
  const socketRooms = socket.adapter.rooms;
  socketRooms.forEach((value, key) => {
    leaveRoom(socket, key);
  });
};

module.exports = {
	listRooms,
	updateUsername,
	joinRoom,
	leaveRoom,
	updateScores,
	nextRound,
	getRealUsernames,
	restartGame,
	disconnect
};