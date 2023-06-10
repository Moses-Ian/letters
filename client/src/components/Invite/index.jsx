
import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import share from "../../assets/images/share.png";
import { sanitize, validateEmail } from "../../utils";
import { useL3ttersContext } from "../../utils/GlobalState";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_FRIENDS,
} from "../../utils/queries";
import { SHARE_LOBBY_BY_EMAIL, SEND_NOTIFICATION } from "../../utils/mutations";

//this is very cute and absolutely not necessary
const url = (room) => `${window.location.origin}/join?room=${room}`;

export default function Invite () {
  const { room } =
    useL3ttersContext();

  const [show, setShow] = useState(false);
	const [emailState, setEmailState] = useState("");
	const [resultMsg, setResultMsg] = useState("");
	const [checked, setChecked] = useState([]);
	const [resultMsg2, setResultMsg2] = useState("");
	const [resultMsg3, setResultMsg3] = useState("");
	
  const [shareLobbyByEmail] = useMutation(SHARE_LOBBY_BY_EMAIL);
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const [getFriends, { data: friendsData }] =
    useLazyQuery(GET_FRIENDS); //data: friendsData takes data and puts it into friendsData

	useEffect(() => {
		if (show)
			getFriends();
	//eslint-disable-next-line
	}, [show]);
	
	useEffect(() => {
		if (show && friendsData)
			setChecked(new Array(friendsData.me.friends.length).fill(false));
	}, [show, friendsData]);

	// this doesn't get called right now
/*  const onShare = async () => {
    console.log("share");
    console.log(url(room));

    //if the os has native share features, use those
    if (navigator.share) {
      navigator.share({
        title: "Join a game on L3tters.com!",
        url: url(room),
        text: `Join ${username} in a game of L3tters!`,
      });
      return;
    }

    // invite all my friends for now
    // const friendsToInvite = friendsData.me.friends.map(
      // (friend) => friend.username
    // );
    // if (friendsToInvite.length !== 0) shareByPush(friendsToInvite);
  };
*/	
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
        if (!validateEmail(email)) throw new Error(`Invalid email - ${email}`);
      });
      const response = await shareLobbyByEmail({
        variables: {
          room,
          to,
        },
      });
			if (response.data.shareLobbyByEmail.success)
				setResultMsg("Invite sent.");
			else
				setResultMsg("Something went wrong.");
			setEmailState("");
    } catch (err) {
      console.error(err);
			setResultMsg("Invalid email address.");
    }
  };
	
	const handleFriendsChange = event => {
		const key = parseInt(event.target.dataset.key);

		setChecked([
			...checked.slice(0, key),
			!checked[key],
			...checked.slice(key+1)
		]);
	};
	
	const handleFriendsSubmit = event => {
		event.preventDefault();
		shareByPush();
	}

  const shareByPush = () => {
    const friends = friendsData.me.friends.reduce((list, friend, index) => checked[index] ? [...list, friend.username] : list, [])
    try {
      sendNotification({ variables: { NotificationInput: { room, friends } } });
			setResultMsg2("Invites sent");
    } catch (err) {
      console.error(err);
			setResultMsg2("Something went wrong.");
    }
  };
	
	const copyLink = () => {
		console.log("copy link");
		try {
			navigator.clipboard.writeText(url(room));
			setResultMsg3("Link copied to clipboard.");
		} catch (err) {
			console.error(err);
			setResultMsg3("Something went wrong.");
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
						<div>{resultMsg}</div>
					</div>
				</form>
				
				{/* list of friends */}
				<form onSubmit={handleFriendsSubmit}>
					<p className="mt-2">Friends</p>
					{friendsData ?
						<div className="room-list m-2">
							{friendsData.me.friends.map((friend, index) => (
								<div className="room-list-div" key={index}>
									<input 
										className="room-list-radio"
										type="checkbox"
										name="friends"
										data-key={index}
										id={friend.username}
										checked={checked[index] || false}
										onChange={handleFriendsChange}
									/>
									<label className="room-list-label pl-2 pt-1 pb-1" htmlFor={friend.username}>
										{friend.username}
										<div className="room-list-label-border" />
									</label>
								</div>
							))}
						</div>
					:
						<p>You should add some friends.</p>
					}
					<button className="search-btn ml-1 button is-small is-warning">Send</button>
					<div>{resultMsg2}</div>
				</form>
				
				{/* link to copy */}
				<button className="l3tters-btn mt-2 ml-1" onClick={copyLink}>Copy Link</button>
				<div>{resultMsg3}</div>
				
				
				
				
				</Modal>
			}
		</div>
	);
};