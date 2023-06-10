import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
			lastLogin
			dailyHints
      friends {
        _id
        username
      }
    }
  }
`;

export const GET_FRIENDS = gql`
	query {
		me {
			friends {
				username
			}
		}
	}
`;

export const QUERY_WORD_OF_THE_DAY = gql`
	query {
		wordOfTheDay
	}
`;