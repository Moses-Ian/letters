import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import friend from "../../assets/images/friend.png";


export default function Friends ({ socket, room }){
  const [show, setShow] = useState(false);
	const [listOfPlayers, setListOfPlayers] = useState([]);
	const [playersAreFriend, setPlayersAreFriend] = useState([false]);

	useEffect(() => {
		if (show) {
			socket.emit('get-real-usernames', room, data => setListOfPlayers(data));
		}
	}, [show]);

	const addFriend = event => {
		event.preventDefault();
		event.stopPropagation();
		console.log(event.target.closest('li').dataset.name);
	};

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
          ></input>
        </div>
        <div>
					<p className=" join-modal-body mt-3">See who's online</p>
					<ul>
					{
						listOfPlayers.map((player, index) => (
							<li key={player} data-name={player}>
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


