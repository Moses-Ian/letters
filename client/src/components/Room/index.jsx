import React, {useState, useEffect} from "react";

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
		socket.on("new-round", newRound => setRound(newRound))

    return () => {
      socket.disconnect();
    };
	}, []);

  const generatePlayerList = (playersArr) => {
    console.log("players list");
    console.log(playersArr[0].username);

    const newPlayersArr = playersArr.map((player) => {
      return player.username;
    });
    setPlayers(newPlayersArr);
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
    <div className="is-flex is-flex-direction-column">
      <h1 className="room-name has-text-centered is-size-4">
        You are playing in: {room}
      </h1>
      {/* TODO remove this */}
      {/* <h2>{isYourTurn ? "It is your turn" : "It is not your turn"}</h2> */}

      {/* TODO add players in room */}
      {/* TODO add active turn highlighted */}
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

			{round % 2
			? <MainGame 
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
			: <NumbersGame 
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
			}
 
			<div className="m-3 has-text-centered">
        <button className="button is-warning m-2" onClick={restartLetters}>
          Restart
        </button>

        <button className="button is-warning m-2" onClick={nextRound}>
          Next Round
        </button>
      </div>
			
			<div className="webster is-flex is-align-self-flex-end pr-2">
				<img className="MW" src={MW} alt="Merriam Webster API" />
			</div>
			
			<LiveChat socket={socket} username={username} room={room} />
    </div>
		</>
  );
}

export default Room;
