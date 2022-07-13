import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import friend from "../../assets/images/friend.png";
import { sanitize } from "../../utils";
import Auth from "../../utils/auth";

//graphql
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS, QUERY_USER } from "../../utils/queries";
import { ADD_FRIEND_USERNAME } from "../../utils/mutations";


export default function Friends ({ socket, room }){
  const [show, setShow] = useState(false);
	// const [listOfPlayers, setListOfPlayers] = useState([]);
	const [listOfPlayers, setListOfPlayers] = useState(['ian3', 'chris', 'hadas', 'moses']); // debug
	const [getFriends, { loading, error: friendsError, data: friendsData }] = useLazyQuery(GET_FRIENDS);	//data: friendsData takes data and puts it into friendsData
	const [playersAreFriend, setPlayersAreFriend] = useState([false]);
	const [addFriendMutation] = useMutation(ADD_FRIEND_USERNAME);
	const [searchState, setSearchState] = useState('');
	const [getUser, {error: searchError, data: searchData}] = useLazyQuery(QUERY_USER);
	const [errorMsg, setErrorMsg] = useState('');
	const [searchResult, setSearchResult] = useState(null);

	//when we show the modal, query for names of users in game and my friends list
	useEffect(() => {
		if (show) {
			// socket.emit('get-real-usernames', room, getRealUsernames);
			if (!friendsData)
				getFriends()
		}
	}, [show]);
	
	const getRealUsernames = (data) => {
		// hide yourself from the list
		if (Auth.loggedIn()) {
			let username = Auth.getProfile().data.username;
			data = data.filter(name => name !== username);
		}
		
		//show the other players
		setListOfPlayers(data);
	}

	//once both of those queries resolve, compare them to see which users in game are my friends
	useEffect(() => {
		if (friendsError) {
			console.error(friendsError);
			return;
		}
		if (loading) return;
		if (listOfPlayers.length === 0) return;
		if (!friendsData) {
			setPlayersAreFriend(new Array(listOfPlayers.length).fill(false));
			return;
		}
		updatePlayersAreFriend(friendsData.me.friends);
	}, [listOfPlayers, loading, friendsError, friendsData]);
	
	const updatePlayersAreFriend = (friends) => {
		let friendDataMap = friends.map(friend => friend.username);
		let friendMap = listOfPlayers.map(player => friendDataMap.includes(player));
		setPlayersAreFriend(friendMap);	
		
		if (searchResult) {
			setSearchResult({
				...searchResult,
				isFriend: friendDataMap.includes(searchResult.username)
			});
		}
	}
	
	const addFriend = async event => {
		event.preventDefault();
		event.stopPropagation();
		let {username} = event.target.closest('li').dataset;
		try {
			const mutationResponse = await addFriendMutation({
				variables: {
					username
				}
			});
			updatePlayersAreFriend(mutationResponse.data.addFriendByUsername.friends);
		} catch (e) {
			console.error(e);
		}
	};
	
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
    <div className="Friends">
      <button className="lobby-btn" onClick={() => setShow(true)}>
        <img src={friend} alt="Friends"/><span>Friends</span>
      </button>
    
    {show && 
    <form>
      <Modal title="Friends" onClose={() => setShow(false)}>
        <div>
          <p className="join-modal-body">Search users to add to friends!!</p>
          <input
          className="user-search input"
          type="text"
          placeholder="Search username"
          name="search"
					value={searchState}
					onChange={handleChange}
          ></input>
					<div>{errorMsg}</div>
					{searchResult &&
						<ul>
							<li data-username={searchResult.username}>
								{searchResult.username}
								{searchResult.isFriend 
								? '✓'
								:	<button onClick={addFriend}>add</button>}
							</li>
						</ul>
					}
					<button onClick={searchUsers}>search</button>
        </div>
        <div>
					<p className=" join-modal-body mt-3">See who's online</p>
					<ul>
					{
						listOfPlayers.map((player, index) => (
							<li key={index} data-username={player}>
								{player} 
								{playersAreFriend[index] 
								? '✓'
								:	<button onClick={addFriend}>add</button>}
							</li>
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


