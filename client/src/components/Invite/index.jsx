import React, { useState } from "react";
import Modal from "../Modal";
import share from "../../assets/images/share.png";
import { sanitize, validateEmail } from "../../utils";
import { useL3ttersContext } from "../../utils/GlobalState";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_FRIENDS,
  QUERY_USER,
} from "../../utils/queries";
import { SHARE_LOBBY_BY_EMAIL, SEND_NOTIFICATION } from "../../utils/mutations";

//this is very cute and absolutely not necessary
const url = (room) => `${window.location.origin}/join?room=${room}`;

export default function Invite () {
  const { socket, username, room, setRoom, deleteToken, loggedIn } =
    useL3ttersContext();

  const [show, setShow] = useState(false);
	const [emailState, setEmailState] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	
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

    //invite all my friends for now
    // const friendsToInvite = friendsData.me.friends.map(
    //   (friend) => friend.username
    // );
    // if (friendsToInvite.length !== 0) shareByPush(friendsToInvite);
  };
	
	const handleEmailChange = event => {
		setEmailState(event.target.value);
	}
	
	const handleEmailSubmit = event => {
		event.preventDefault();
		shareByEmail();
	}

  const shareByEmail = async () => {
    //sends the email once the 'to' field has been filled
		const address = sanitize(emailState);
    const to = [address];
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
			if (response.data.shareLobbyByEmail.success)
				setErrorMsg("Invite sent.");
			else
				setErrorMsg("Something went wrong.");
			setEmailState("");
    } catch (err) {
      console.error(err);
			setErrorMsg("Invalid email address.");
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
		<div>
			<button className="lobby-btn" onClick={() => setShow(true)}>
				<img src={share} alt="Invite" /><span>Invite</span>
			</button>
			
			{show &&
				<Modal hideEnterButton={true} title="Invite" onClose={() => setShow(false)}>
				
				{/* add by email */}
				<form onSubmit={handleEmailSubmit}>
					<p>Email</p>
					<div>
						<div className="flex-friend mt-2">
							<input
								className="user-search"
								type="email"
								value={emailState}
								onChange={handleEmailChange}
							></input>
							<button className="search-btn ml-1 button is-small is-warning">Send</button>
						</div>
						<div>{errorMsg}</div>
					</div>
				</form>
				
				{/* list of friends */}
				
					<p>Friends</p>
				
				
				{/* link to copy */}
				<button className="l3tters-btn">Copy Link</button>
				
				
				
				
				
				</Modal>
			}
		</div>
	);
};