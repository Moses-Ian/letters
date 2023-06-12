import add from "../../assets/images/add-friend.png"

//graphql
import { useMutation } from "@apollo/client";
import { REQUEST_FRIEND_USERNAME } from "../../utils/mutations";

export default function FriendListItem ({ username, friendStatus, updatePlayersAreFriend }){
	
	const [requestFriendMutation] = useMutation(REQUEST_FRIEND_USERNAME);

	const requestFriend = async event => {
		event.preventDefault();
		event.stopPropagation();
		let {username} = event.target.closest('li').dataset;
		try {
			const mutationResponse = await requestFriendMutation({
				variables: {
					username
				}
			});
			updatePlayersAreFriend(mutationResponse.data.requestFriendByUsername.friends);
			console.log("friend request sent");
		} catch (e) {
			console.error(e);
		}
	};
	
	console.log(`user=${username} status=${friendStatus}`);
	
	return (
		<li data-username={username}>
			{username}
			{friendStatus == 'friends' 
			? '✓'
			:	<button className="add-btn" onClick={requestFriend}><img src={add} alt="Add button"/></button>}
		</li>
	);
}