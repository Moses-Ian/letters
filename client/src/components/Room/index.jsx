import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import MW from "../../assets/images/Merriam-Webster.png";
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
	setDailyHints
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
    socket.on("new-round", (newRound) => setRound(newRound));
    socket.on("set-game-state-room", setGameState);
		socket.on("update-username", (newUsername) => setUsername(newUsername));

    return () => {
      socket.disconnect();
    };
  }, [socket]);
	
	const swipeConfig = {
		delta: 10,                             // min distance(px) before a swipe starts. *See Notes*
		preventScrollOnSwipe: false,           // prevents scroll during swipe (*See Details*)
		trackTouch: true,                      // track touch input
		trackMouse: false,                     // track mouse input
		rotationAngle: 0,                      // set a rotation angle
		swipeDuration: Infinity,               // allowable duration of a swipe (ms). *See Notes*
		touchEventOptions: { passive: true },  // options for touch listeners (*See Details*)
	}

	
	const swipeHandlers = useSwipeable({
		onSwiped: (eventData) => console.log("User Swiped!", eventData),
		...swipeConfig,
	});

  const generatePlayerList = async (playersArr) => {
    const newPlayersArr = await playersArr.map((player) => {
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

  const setGameState = (round) => {
   setRound(round);
  };

  return (
    <>
			<div className="room" {...swipeHandlers}>
				<div className="is-flex is-flex-direction-column is-justify-content-center">
					{/*<h1 className="room-name has-text-centered is-size-4">
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
					</div>*/}

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

					
				 {/* winner here */}
					

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

					{/*<LiveChat socket={socket} username={username} room={room} />*/}
				</div>
			</div>
    </>
  );
}

export default Room;
