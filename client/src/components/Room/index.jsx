// import React from "react";
// import { io } from "socket.io-client";

// function Room() {
//   //variables
//   //==================================
//   let room = "myRoom";

//   const roomNameEl = document.querySelector("#room-name");
//   const joinGlobalBtn = document.querySelector("#join-global");
//   const joinRoomBtn = document.querySelector("#join-room");
//   const createRoomBtn = document.querySelector("#create-room");
//   const roomNameInput = document.querySelector("#room-name-input");

//   //functions
//   //====================================
//   const joinGlobal = () => {
//     socket.emit("join-game", "Global Game", room, (success, newRoom) => {
//       if (success) setRoom(newRoom);
//     });
//     console.log(`joinRoom Global Game`);
//   };

//   const joinRoom = (name) => {
//     socket.emit("join-game", name, room, (success, newRoom) => {
//       if (success) setRoom(newRoom);
//     });
//     console.log(`joinRoom ${name}`);
//   };

//   const createRoom = () => {
//     socket.emit("join-game", name, room, (success, newRoom) => {
//       if (success) setRoom(newRoom);
//     });
//     console.log(`joinRoom ${roomNameInput.value}`);
//   };

//   const setRoom = (newRoom) => {
//     room = newRoom;
//     roomNameEl.textContent = room;
//     localStorage.setItem("room", room);
//   };

//   const getRoom = () => {
//     let r = localStorage.getItem("room");
//     if (!r) return "Global Game";
//     return r;
//   };

//   const joinGlobalHandler = () => joinGlobal();

//   const joinRoomHandler = () => joinRoom(roomNameInput.value);

//   const createRoomHandler = () => createRoom(roomNameInput.value);

//   //listeners
//   //=====================================
//   joinGlobalBtn.addEventListener("click", joinGlobalHandler);
//   joinRoomBtn.addEventListener("click", joinRoomHandler);
//   createRoomBtn.addEventListener("click", createRoomHandler);

//   //body
//   //=====================================

//   return <div>Room</div>;
// }

// export default Room;
