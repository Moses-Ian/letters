class GameObj {
	constructor (name) {
		this.letters = [];
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.words = [];
		this.name = name || '';	
		this.players = [];
		this.turn = -1;
	}
	
	restart() {
		this.letters = [];
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.words = [];
	}
	
	add(player) {
		this.players.push(player);
		if (this.turn == -1)
			this.turn = 0;
	}
	
	remove(player) {
		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
		if (this.turn >= this.players.length)
			this.turn = 0;
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