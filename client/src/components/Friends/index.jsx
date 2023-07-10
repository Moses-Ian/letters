import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import FriendListItem from "../FriendListItem";
import friend from "../../assets/images/friend.png";
import { sanitize } from "../../utils";
import Auth from "../../utils/auth";
import { useL3ttersContext } from "../../utils/GlobalState";

//graphql
import { useLazyQuery } from "@apollo/client";
import { GET_FRIENDS, QUERY_USER } from "../../utils/queries";


export default function Friends (){
	const { socket, room } = useL3ttersContext();
	
  const [show, setShow] = useState(false);
	const [players, setPlayers] = useState([]);
	// const [players, setPlayers] = useState(['ian3', 'chris', 'hadas', 'moses']); // debug
	const [getFriends, { loading, error: friendsError, data: friendsData }] = useLazyQuery(GET_FRIENDS);	//data: friendsData takes data and puts it into friendsData
	const [playersAreFriend, setPlayersAreFriend] = useState([false]);
	const [searchState, setSearchState] = useState('');
	const [getUser] = useLazyQuery(QUERY_USER);
	const [errorMsg, setErrorMsg] = useState('');
	const [searchResult, setSearchResult] = useState(null);

	//when we show the modal, query for names of users in game and my friends list
	useEffect(() => {
		if (show) {
			socket.emit('get-real-usernames', room, getRealUsernames);
			if (!friendsData)
				getFriends()
		}
	// eslint-disable-next-line
	}, [show]);
	
	const getRealUsernames = (data) => {
		// hide yourself from the list
		if (Auth.loggedIn()) {
			let username = Auth.getProfile().data.username;
			data = data.filter(name => name !== username);
		}
		
		//show the other players
		setPlayers(data.map(username => {
			let player = new Object();
			player.username = username;
			return player;
		}));
	}

	//once both of those queries resolve, compare them to see which users in game are my friends
	useEffect(() => {
		console.log("useEffect");
		if (friendsError) {
			console.error(friendsError);
			return;
		}
		if (loading) return;
		if (players.length === 0) return;
		if (!friendsData) {
			setPlayersAreFriend(new Array(players.length).fill('add friend'));
			return;
		}
		console.log(friendsData.me.friends);
		updatePlayersAreFriend(friendsData.me.friends);
	// eslint-disable-next-line
	}, [players, loading, friendsError, friendsData]);
	
	const updatePlayersAreFriend = (friends) => {
		console.log(players);
		console.log(friends);
		let playerFriendStatuses = [...players];
		playerFriendStatuses.forEach(player => {
			let friend = friends.find(friend => 
				friend.recipient.username == player.username || 
				friend.requester.username == player.username
			);
			player.status = friend == null ? 'add friend' : friend.status;
		});
		setPlayersAreFriend(playerFriendStatuses);	
		
		if (searchResult) {
			setSearchResult({
				...searchResult,
				// isFriend: friendDataMap.includes(searchResult.username)
			});
		}
	}
	
	const handleChange = event => {
		setSearchState(event.target.value);
	};
	
	const searchUsers = async event => {
		event.preventDefault();
		event.stopPropagation();
		setSearchState('');
		
		let username = sanitize(searchState);
		if (username === '')
			return;
		const result = await getUser({
			variables: {
				username
			}
		});
		if (!result.data.user) {
			setErrorMsg(`No user named ${username}`);
			return;
		}
		setErrorMsg('');
		if (!friendsData) 
			setSearchResult({username, isFriend: false});
		else {
			let friendDataMap = friendsData.me.friends.map(friend => friend.username);
			setSearchResult({
				username,
				isFriend: friendDataMap.includes(result.data.user.username)
			});
		}
	}
	
	
	
  return (
    <div>
      <button className="lobby-btn" onClick={() => setShow(true)}>
        <img src={friend} alt="Friends list"/><span>Friends</span>
      </button>
    
    {show && 
    <form>
      <Modal hideEnterButton={true} title="Friends" onClose={() => setShow(false)}>
        <div>
          <p>Search users to add to friends!!</p>
						
          <div className="flex-friend mt-2">
            <input
            className="user-search"
            type="text"
            placeholder="Search username"
            name="search"
            value={searchState}
            onChange={handleChange}
            ></input>

          <button className="search-btn ml-1 button is-small is-warning" onClick={searchUsers}>Find</button>
        </div>

				<div>{errorMsg}</div>
					{searchResult &&
						<ul>
							<FriendListItem 
								username={searchResult.username} 
								friendStatus={searchResult.isFriend} 
								updatePlayersAreFriend={updatePlayersAreFriend} 
							/>
						</ul>
					}
					
        </div>
        <div>
					<p className="mt-3">See who's online</p>
					<ul>
					{
						players.map((player, index) => (
							<FriendListItem 
								key={index} 
								username={player.username} 
								friendStatus={player.status} 
								updatePlayersAreFriend={updatePlayersAreFriend} 
							/>
						))
					}
					</ul>
        </div>
      </Modal>
    </form>
    }
    </div>
  )
}
