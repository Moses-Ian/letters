const GameTimer = require("./GameTimer");

class GameObj {
	constructor (name, options) {
		//room
		this.name = name || '';	
		this.visible = options.visible === undefined ? true : options.visible;
		this.gameTimer = new GameTimer(this);
		// this.password = '';
		// letters game
		this.letters = new Array(9).fill('');
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.letterCount = 0;
		this.words = [];
		// numbers game
		this.numbers = new Array(6).fill('');
		this.smallNumberCount = 0;
		this.largeNumberCount = 0;
		this.numberCount = 0;
		this.target = 0;
		this.operations = []; 
		// players
		this.players = [];
		this.turn = -1;
		this.round = 1;
		// game settings	-> this is a really big issue. i'll tackle this in earnest later
		// this.mode = "ffa";
		// this.maxPlayers = -1;	//no limit
		// this.teams = [];			//in teams, this will be an array of arrays of playerIDs
		// this.maxRounds = 6;
		// this.hintsAllowed = true;
		
	}
	
	clearBoard() {
		this.letters = new Array(9).fill('');
		this.vowelCount = 0;
		this.consonantCount = 0;
		this.letterCount = 0;
		this.words = [];
		
		this.numbers = new Array(6).fill('');
		this.smallNumberCount = 0;
		this.largeNumberCount = 0;
		this.numberCount = 0;
		this.target = 0;
		this.operations = []; 
		
		return this.turn;
	}
	
	restart() {
		this.players.forEach(player => player.restart());
		// this.turn = -1; //don't reset the turn -> change up the first player each game
		this.round = 1;
		
		return this.clearBoard();
	}
	
	add(player) {
		player.addNumberToUsername(this.players);
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
		if (this.players.length === 2) {
			if (this.round % 4 === 1 || this.round % 4 === 3)
				this.turn++
		}	else {
			this.turn++;
		}
		if (this.turn >= this.players.length)
			this.turn = 0;
		this.clearBoard();
		this.round++;
		return this.turn;
	}
	
	updatePlayerUsername(id, username) {
		let player = this.getPlayerById(id);
		player.addNumberToUsername(this.players);
		return player;
	}
	
	getPlayerById(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return this.players[i];
      }
    }
	}
	
  getPlayer(username) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].username === username) {
        return this.players[i];
      }
    }
  }
	
	getPlayers() {
		return this.players.map(({ username, score }) => {
			return { username, score };
		});
	}
	
	addRandom() {
		if (this.round % 2) {
			// letters game
			if (this.vowelCount >= 5) {
				addConsonant(this.name);
				return;
			}
			if (this.consonantCount >= 6) {
				addVowel(this.name);
				return;
			}
			if (Math.random() < 0.45) {
				addVowel(this.name);
				return;
			}
			addConsonant(this.name);
			return;
		}
		// numbers game
		if (this.largeNumberCount >= 4) {
			addSmallNumber(this.name);
			return;
		}
		if (this.smallNumberCount >= 4) {
			addLargeNumber(this.name);
			return;
		}
		if (Math.random() < 0.67) {
			addSmallNumber(this.name);
			return;
		}
		addLargeNumber(this.name);
		return;
	}
}

module.exports = GameObj;
