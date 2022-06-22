class PlayerObj {
  constructor(username, id) {
    this.id = id;
    this.username = username;
    this.score = 0;
		this.submission = {};
  }
	
	updateUsername(username) {
		this.username = username;
	}

	addNumberToUsername(players) {
		const re = new RegExp(`${this.username}(?<tag>[0-9]*)`)
		const maxUsername = players.reduce((maxUsername, player) => {
			const matches = player.username.match(re);
			if (matches) {
				if (matches.groups.tag == '')
					return (Math.max(maxUsername, 0));
				return (Math.max(maxUsername, matches.groups.tag));
			}
			return maxUsername;
		}, -1);
		const yourNumber = maxUsername == -1 ? '' : maxUsername+1;
		this.username += yourNumber;
		// return {
			// username: `${username}${yourNumber}`,
			// ...player
		// };
	}
	
	addSubmission(submission) {
		if (submission.score === 0) return;
		if (!this.submission.score || submission.score > this.submission.score)
			this.submission = submission;
	}
	
	restart() {
		this.score = 0;
		this.submission = {};
	}

}

module.exports = PlayerObj;
