import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
				dailyHints
      }
    }
  }
`;

export const EXTEND = gql`
	mutation {
		extend {
			token
		}
	}
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
				dailyHints
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const ADD_FRIEND_USERNAME = gql`
	mutation addFriendByUsername($username: String!) {
		addFriendByUsername(username: $username) {
			friends {
				username
			}
		}
	}
`;

export const SEND_EMAIL = gql`
	mutation sendEmail($input:EmailInput!) {
		sendEmail(input:$input) {
			success
			message
			error
		}
	}
`;

export const SHARE_LOBBY_BY_EMAIL = gql`
	mutation shareLobbyByEmail($room: String!, $to: [String]!) {
		shareLobbyByEmail(room: $room, to: $to) {
			success
			message
			error
		}
	}
`;

export const SEND_NOTIFICATION = gql`
	mutation sendNotification($NotificationInput: NotificationInput!) {
		sendNotification(input: $NotificationInput) {
			void
		}
	}
`;