class GameObj {
	constructor (name) {
		// letters game
		this.letters = new Array(9).fill('');
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.letterCount = 0;
		this.words = [];
		// players
		this.name = name || '';	
		this.players = [];
		this.turn = -1;
		// numbers game
		this.numbers = new Array(6).fill('');
		this.smallNumberCount = 0;
		this.largeNumberCount = 0;
		this.numberCount = 0;
		
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
}

module.exports = GameObj;