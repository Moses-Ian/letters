import React, { useState, useEffect } from "react";
import MW from "../../assets/images/Merriam-Webster.png";
import Lobby from '../Lobby';
import MainGame from "../MainGame";
import NumbersGame from "../NumbersGame";
import LiveChat from "../LiveChat";


function Room({ 
	socket, 
	username, 
	setUsername, 
	room, 
	loggedIn, 
	jwt,
	dailyHints,
	setDailyHints,
	isMobile,
	display
}) {
  const [players, setPlayers] = useState([]);
  const [activeTimer, setActiveTimer] = useState(false);
  const [isYourTurn, setTurn] = useState(false);
  const [round, setRound] = useState(1);
  const [activePlayer, setActivePlayer] = useState("");
  const [score, setScore] = useState(0);
	
  useEffect(() => {
    socket.on("send-players", generatePlayerList);
    socket.on("your-turn", () => setTurn(true));
    // socket.on("new-round", (newRound) => setRound(newRound));
    socket.on("new-round", (newRound) => {
			setRound(newRound);
			console.log(newRound);
		});
    socket.on("set-game-state-room", setGameState);
		socket.on("update-username", (newUsername) => setUsername(newUsername));

    return () => {
      socket.disconnect();
    };
  }, [socket]);
	
  const generatePlayerList = async (playersArr, turn) => {
    setPlayers(playersArr);
    setActivePlayer(playersArr[turn].username);
  };

  const nextRound = () => {
    socket.emit("next-round", room);
    // socket.emit("save-score", score, room, username);
    setScore(0);
  };

  const restartGame = (event) => {
    socket.emit("restart-game", room);
    setActiveTimer(false);
  };

  const setGameState = (round) => {
   setRound(round);
  };
	
	const setLobbyDisplay = () => {
		if (!isMobile || display==='lobby')
			return 'active-view';
		return 'inactive-view-left';
	}
	
	const setGameDisplay = () => {
		if (!isMobile || display === 'game')
			return 'active-view';
		if (display === 'lobby')
			return 'inactive-view-right';
		if (display === 'chat')
			return 'inactive-view-left';
	}
	
	const setChatDisplay = () => {
		if (!isMobile || display==='chat')
			return 'active-view';
		return 'inactive-view-right';
	}
	
  return (
    <>
			<div className="room">
					
				<Lobby
					room={room}
					players={players}
					activePlayer={activePlayer}
					display={setLobbyDisplay()}
				/>

				<div className={`view ${setGameDisplay()}`}>
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
							loggedIn={loggedIn}
							jwt={jwt}
							dailyHints={dailyHints}
							setDailyHints={setDailyHints}
							display={setGameDisplay()}
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
							loggedIn={loggedIn}
							jwt={jwt}
							dailyHints={dailyHints}
							setDailyHints={setDailyHints}
							display={setGameDisplay()}
						/>
					)}
					<div className="m-3 has-text-centered is-flex is-justify-content-center">
						<button className="button is-warning m-2" onClick={restartGame}>
							Restart
						</button>

						<button className="button is-warning m-2" onClick={nextRound}>
							Next Round
						</button>
						<div className="webster is-flex is-justify-content-flex-end">
							<img className="MW" src={MW} alt="Merriam Webster API" />
						</div>
					</div>
				</div>

				{display === 'winner' ?
					{/*winner component here*/}
				: ("")}
					
				<LiveChat 
					socket={socket} 
					username={username} 
					room={room} 
					display={setChatDisplay()}
				/>
			</div>
    </>
  );
}

export default Room;
