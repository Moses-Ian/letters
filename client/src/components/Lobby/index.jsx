import React from "react";
import swipeRight from "../../assets/images/swipe-left7.png";
import settings from "../../assets/images/settings.png";
import share from "../../assets/images/share.png";
import leave from "../../assets/images/leave.png";
import logout from "../../assets/images/logout.png";
// import friend from "../../assets/images/friend.png"
import dollar from "../../assets/images/dollar.png";
import { validateEmail } from "../../utils";
import Auth from "../../utils/auth";

import Friends from "../Friends";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS, QUERY_USER } from "../../utils/queries";
import { SHARE_LOBBY_BY_EMAIL, SEND_NOTIFICATION } from "../../utils/mutations";

//this is very cute and absolutely not necessary
const url = (room) => `${window.location.origin}/join?room=${room}`;

const Lobby = ({ socket, username, room, players, activePlayer, display }) => {
  const [shareLobbyByEmail] = useMutation(SHARE_LOBBY_BY_EMAIL);
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const [getFriends, { loading, error: friendsError, data: friendsData }] =
    useLazyQuery(GET_FRIENDS); //data: friendsData takes data and puts it into friendsData

  const onShare = async () => {
    console.log("share");
    console.log(url(room));

    //if the os has native share features, use those
    // if (navigator.share) {
    //   navigator.share({
    //     title: "Join a game on L3tters.com!",
    //     url: url(room),
    //     text: `Join ${username} in a game of L3tters!`,
    //   });
    //   return;
    // }

    //sends the email once the 'to' field has been filled
    //clicking the button should open up a modal first
    // to be filled by user -> MUST VALIDATE
    const to = ["hadas.gadish@gmail.com"];
    if (to.length !== 0) shareByEmail(to);

    //invite all my friends for now
    // const friendsToInvite = friendsData.me.friends.map(
    //   (friend) => friend.username
    // );
    // if (friendsToInvite.length !== 0) shareByPush(friendsToInvite);
  };

  const shareByEmail = async (to) => {
    try {
      to.forEach((email) => {
        if (!validateEmail(email)) throw `Invalid email - ${email}`;
      });
      const response = await shareLobbyByEmail({
        variables: {
          room,
          to,
        },
      });
      console.log(response.data.shareLobbyByEmail);
    } catch (err) {
      console.error(err);
    }
  };

  const shareByPush = (friends) => {
    friends = ["ian", "moses", "ian2", "ianm"];

    try {
      sendNotification({ variables: { NotificationInput: { room, friends } } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`view ${display}`}>
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
                - {player.username} {player.score} points
              </li>
            ))}
          </ul>
        </div>
        <div className="lobby">
          <p className="wotd-head">
            WORD OF THE DAY!!<span className="wotd">PLACEHOLDER</span>
            <span className="bonus">
              {" "}
              5 bonus points if you find this word.
            </span>
          </p>

          <div className="button-flex">
            <button className="lobby-btn">
              <img src={dollar} alt="Store" />
              <span>Store</span>
            </button>

            <button className="lobby-btn">
              <img src={settings} alt="Settings" />
              <span>Settings</span>
            </button>

            <button className="lobby-btn" onClick={onShare}>
              <img src={share} alt="Invite" />
              <span>Invite</span>
            </button>

            <Friends socket={socket} username={username} room={room} />

            <button className="lobby-btn">
              <img src={logout}></img>
              <span>Logout</span>
            </button>

            <button className="lobby-btn">
              <img src={leave}></img>
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
