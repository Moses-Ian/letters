const Game = require("../utils/GameObj.js");
const PlayerObj = require("../utils/PlayerObj.js");

nextRound = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.nextTurn();
	saveScore(g);
	io.to(g.name).emit('new-round', g.round);
  io.to(g.name).emit("clear-letters");
  io.to(g.name).emit("send-players", g.getPlayers(), g.turn);
  tellTurn(g, turn);
};

saveScore = g => {
	g.players.forEach(player => {
		if (player.submission.score) {
			player.score += player.submission.score;
			player.submission = {};
		}
	});
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
	if (player.username !== username)
		setTimeout(
			() => io.to(socket.id).emit("update-username", player.username),
			2000
		);
  tellTurn(g, turn);
  //leave the old room
  leaveRoom(socket, oldRoom);
  //send it back to client
  callback(true, room);
  setTimeout(
    () => io.to(socket.id).emit("set-game-state-room", g.round),
    1000
  );
  setTimeout(() => io.to(g.name).emit("send-players", g.getPlayers(), g.turn), 1500);
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

restartGame = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.restart();
  tellTurn(g, turn);
	io.to(g.name).emit('set-game-state-room', g.round);
  io.to(g.name).emit("clear-letters");
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
	joinRoom,
	leaveRoom,
	nextRound,
	saveScore,
	restartGame,
	disconnect
};