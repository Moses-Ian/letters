import React, { useState, useEffect } from "react";
import MW from "../../assets/images/Merriam-Webster.png";
import MainGame from "../MainGame";
import NumbersGame from "../NumbersGame";
import LiveChat from "../LiveChat";

function Room({ socket, username, room }) {
  const [players, setPlayers] = useState([]);
  const [activeTimer, setActiveTimer] = useState(false);
  const [isYourTurn, setTurn] = useState(false);
  const [round, setRound] = useState(1);
  const [activePlayer, setActivePlayer] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    socket.on("send-players", generatePlayerList);
    socket.on("your-turn", () => setTurn(true));
    socket.on("new-round", (newRound) => setRound(newRound));

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const generatePlayerList = (playersArr) => {
    const newPlayersArr = playersArr.map((player) => {
      return player.username;
    });
    setPlayers(newPlayersArr);
    setActivePlayer(newPlayersArr.username);
  };

  const nextRound = () => {
    socket.emit("next-round", room);
    socket.emit("save-score", score, room, username);
    setScore(0);
  };

  const restartLetters = (event) => {
    socket.emit("restart-letters", room);
    setActiveTimer(false);
  };

  return (
    <>
      <div className="is-flex is-flex-direction-column is-justify-content-center">
        <h1 className="room-name has-text-centered is-size-4">
          You are playing in: {room}
        </h1>

        <div className="players is-align-self-center">
          <div>
            <h1 className="has-text-warning">Players:</h1>
          </div>
          <ul>
            {players.map((player, index) => (
              <li
                className={
                  "playerLi " +
                  (activePlayer === player.username
                    ? "active-player"
                    : "not-active")
                }
                key={index}
              >
                - {player}
              </li>
            ))}
          </ul>
        </div>

        {round % 2 ? (
          <MainGame
            socket={socket}
            username={username}
            room={room}
            activeTimer={activeTimer}
            setActiveTimer={setActiveTimer}
            isYourTurn={isYourTurn}
            setTurn={setTurn}
            score={score}
            setScore={setScore}
          />
        ) : (
          <NumbersGame
            socket={socket}
            username={username}
            room={room}
            activeTimer={activeTimer}
            setActiveTimer={setActiveTimer}
            isYourTurn={isYourTurn}
            setTurn={setTurn}
            score={score}
            setScore={setScore}
          />
        )}

        <div className="m-3 has-text-centered is-flex is-justify-content-center">
          <button className="button is-warning m-2" onClick={restartLetters}>
            Restart
          </button>

          <button className="button is-warning m-2" onClick={nextRound}>
            Next Round
          </button>
          <div className="webster is-flex is-justify-content-flex-end">
            <img className="MW" src={MW} alt="Merriam Webster API" />
          </div>
        </div>

        <LiveChat socket={socket} username={username} room={room} />
      </div>
    </>
  );
}

export default Room;
