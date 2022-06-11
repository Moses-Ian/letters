const Game = require("../utils/GameObj.js");
const PlayerObj = require("../utils/PlayerObj.js");

nextRound = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.nextTurn();
	io.to(room).emit('new-round', g.round);
  io.to(room).emit("clear-letters");
  io.to(room).emit("send-players", g.players);
  tellTurn(g, turn);
};

saveScore = (score, room, username) => {
  let g = rooms.get(room);
  if (!g) return;
  let player = g.getPlayer(username);
	if (!player) return;
  player.score += score;
};

joinRoom = (socket, room, oldRoom, username, callback) => {
  //get the rooms
  let g = rooms.get(room);
  if (!g) {
    g = new Game(room); //create the room
    rooms.set(room, g);
  }
  //join the rooms
  socket.join(room);
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
  setTimeout(() => io.to(room).emit("send-players", g.players), 1500);
};

leaveRoom = (socket, room) => {
  socket.leave(room);
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.remove(socket.id);
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

disconnect = (socket, reason) => {
  console.log(`disconnect:  ${socket.id}`);
  const socketRooms = socket.adapter.rooms;
  socketRooms.forEach((value, key) => {
    leaveRoom(socket, key);
  });
};

module.exports = {
	joinRoom,
	nextRound,
	saveScore,
	disconnect
};