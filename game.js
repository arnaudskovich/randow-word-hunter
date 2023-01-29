const alphabet = "abcdefghijklmnopqrstuvwxyz";
const lPlaceholders = document.getElementsByClassName("letter");
const lForm = document.getElementById("bottom");
const lInput = document.getElementById("letter");
const badLetters = document.getElementById("bad_letters");
const lifeCount = document.getElementById("life_count");
const submit = document.getElementById("submitBtn");
const restart = document.getElementById("restartBtn");
const feedback = document.getElementById("feedback");

class Game {
	constructor() {
		this._lives = 8;
		this._validLetters = ["", "", "", "", "", ""];
		this._invalidLetters = [];
		this._word = "";
	}
	generateWord() {
		const letters = [];
		while (letters.join("").length < 6) {
			const toAdd = alphabet[(Math.random().toString()[Math.random().toString()[2]] * 1000) % 26];
			letters.push(toAdd);
		}
		this._word = letters.join("");
		return this._word;
	}
	hasLetterIn(letter) {
		const letterPos = this._word.indexOf(letter);
		if (letterPos !== -1) {
			const positions = [letterPos];
			this._validLetters[letterPos] = letter;
			for (let i = letterPos + 1; i < 6; i++) {
				if (this._word[i] === letter) {
					positions.push(i);
					this._validLetters[i] = letter;
				} else continue;
			}
			return positions;
		}
		if (this._invalidLetters.indexOf(letter) === -1) {
			const nextLives = this._lives - 1;
			this._lives = nextLives >= 0 ? nextLives : 0;
			this._invalidLetters.push(letter);
		}
		return false;
	}
	hasWon() {
		return this._validLetters.join("") === this._word;
	}
	reset() {
		this._invalidLetters = [];
		this._validLetters = [];
		this._word = this.generateWord();
		this._lives = 8;
	}
}

const game = new Game();
game.generateWord();
lForm.addEventListener("submit", (e) => {
	e.preventDefault();
	e.stopPropagation();
	const vl = lInput.value;
	lInput.disabled = true;
	submit.disabled = true;
	lInput.value = "";
	let letterState = game.hasLetterIn(vl);
	if (!letterState) {
		feedback.innerText = "Mauvaise lettre";
		feedback.style.backgroundColor = "rgba(207, 2, 2, 0.651)";

		lifeCount.innerText = game._lives;
		badLetters.innerText = game._invalidLetters.join("");
		if (game._lives <= 0) {
			lInput.disabled = true;
			submit.disabled = true;
			feedback.innerText = "Vous avez perdu !";
			feedback.style.backgroundColor = "rgba(207, 2, 2, 0.651)";
			return;
		} else {
			setTimeout(() => {
				feedback.style.backgroundColor = "rgb(238, 238, 238)";
				feedback.innerText = "Entrez une lettre";
			}, 500);
		}
		lInput.disabled = false;
		submit.disabled = false;
		lInput.focus();
		return;
	}
	feedback.innerText = "Bonne lettre";
	feedback.style.backgroundColor = "rgba(2, 207, 36, 0.651)";
	for (const pos in letterState) {
		lPlaceholders[letterState[pos]].innerText = vl;
	}
	if (game.hasWon()) {
		feedback.innerText = "Vous avez trouvé le mot";
		feedback.style.backgroundColor = "rgba(2, 207, 36, 0.651)";
		return;
	} else {
		setTimeout(() => {
			feedback.style.backgroundColor = "rgb(238, 238, 238)";
			feedback.innerText = "Entrez une lettre";
		}, 500);
	}

	lInput.disabled = false;
	submit.disabled = false;
	lInput.focus();
});

restart.onclick = function () {
	game.reset();
	lInput.disabled = false;
	submit.disabled = false;
	for (const p in lPlaceholders) {
		lPlaceholders[p].innerText = "?";
	}
	feedback.style.backgroundColor = "rgb(238, 238, 238)";
	feedback.innerText = "Entrez une lettre";
	lifeCount.innerText = game._lives;
	badLetters.innerText = "";
};
