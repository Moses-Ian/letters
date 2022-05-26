class GameObj {
	constructor (name) {
		this.letters = [];
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.words = [];
		this.name = name || '';	
		this.players = [];
	}
	
	restart() {
		this.letters = [];
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.words = [];
	}
	
	add(player) {
		this.players.push(player)
	}
	
	remove(player) {
		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
	}
}

module.exports = GameObj;