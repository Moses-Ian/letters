class GameObj {
	constructor (name) {
		this.letters = new Array(9).fill('');
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.letterCount = 0;
		this.words = [];
		this.name = name || '';	
		this.players = [];
		this.turn = -1;
	}
	
	restart() {
		this.letters.fill('');
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.letterCount = 0;
		this.words = [];
		return this.turn;
	}
	
	add(player) {
		if (player.username == 'Guest')
			player = this.addNumberToGuest(player);
		this.players.push(player);
		if (this.turn == -1)
			this.turn = 0;
		return this.turn;
	}
	
	remove(playerID) {
		for(let i=0; i<this.players.length; i++)
			if (this.players[i].id == playerID) {
				this.players.splice(i, 1);
				break;
			}
		if (this.turn >= this.players.length)
			this.turn = 0;
		return this.turn;
	}
	
	nextTurn() {
		this.turn++;
		if (this.turn >= this.players.length)
			this.turn = 0;
		this.restart();
		return this.turn;
	}
	
	addNumberToGuest({username, ...player}) {
		const maxGuest = this.players.reduce((maxGuest, player) => {
			const matches = player.username.match(/Guest(?<tag>[0-9]*)/);
			if (matches) {
				if (matches.groups.tag == '')
					return (Math.max(maxGuest, 0));
				return (Math.max(maxGuest, matches.groups.tag));
			}
		}, -1);
		const yourNumber = maxGuest == -1 ? '' : maxGuest+1;
		return {
			username: `Guest${yourNumber}`,
			...player
		};
	}
}

module.exports = GameObj;