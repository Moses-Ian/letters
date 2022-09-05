import React from "react";
import swipeRight from "../../assets/images/swipe-left7.png";
import settings from "../../assets/images/settings.png";
import leave from "../../assets/images/leave.png";
import logout from "../../assets/images/logout.png";
// import friend from "../../assets/images/friend.png"
import dollar from "../../assets/images/dollar.png";
import Invite from "../Invite";
import Friends from "../Friends";
import { useL3ttersContext } from "../../utils/GlobalState";

import { useQuery } from "@apollo/client";
import { QUERY_WORD_OF_THE_DAY } from "../../utils/queries";

const Lobby = ({ players, activePlayer, display }) => {
  const { socket, room, setRoom, deleteToken, loggedIn } =
    useL3ttersContext();

  const { loading: loadWord, data: wordData } = useQuery(QUERY_WORD_OF_THE_DAY);

  const leaveRoom = () => {
    socket.emit("leave-game", room, () => setRoom(""));
    localStorage.removeItem("room");
  };

  return (
    <div className={`view ${display}`}>
      <div className="is-flex is-flex-direction-column is-justify-content-center">
        <h1 className="room-name has-text-centered is-size-4">
          You are playing in: {room}
        </h1>

        <div className="lobby">
          <div className="wotd-head">
            <p>WORD OF THE DAY!!</p>
            <p>
              <span className="wotd highlight">
                {!loadWord ? wordData.wordOfTheDay : "---"}
              </span>
            </p>
            <p>
              <span className="bonus">
                {" "}
                5 bonus points if you find this word.
              </span>
            </p>
          </div>

          <div className="button-flex">
            <button className="lobby-btn">
              <img src={dollar} alt="Store" />
              <span>Store</span>
            </button>

            <button className="lobby-btn">
              <img src={settings} alt="Settings" />
              <span>Settings</span>
            </button>

						<Invite />

            <Friends />

            <button
              className="lobby-btn"
              onClick={deleteToken}
              disabled={!loggedIn}
            >
              <img src={logout} alt="logout"></img>
              <span>Logout</span>
            </button>

            <button className="lobby-btn" onClick={leaveRoom}>
              <img src={leave} alt="leave game"></img>
              <span>Leave</span>
            </button>
          </div>
          <p className="swipe-arrows">
            Swipe to play{" "}
            <span className="arrow-image">
              <img src={swipeRight} alt="right arrow" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
