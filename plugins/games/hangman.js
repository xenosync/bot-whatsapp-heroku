const fetch = require('node-fetch')
let gamesUrl = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/games/tebakkata.json'

class HangmanGame {
constructor(id) {
this.sessionId = id;
this.guesses = [];
this.maxAttempts = 0;
this.currentStage = 0;
}

getRandomQuest = async () => {
try {
let data = await fetch(gamesUrl).then(response => response.json())
let { soal, jawaban } = data.result.random();
return { clue: soal, quest: jawaban.toLowerCase() };
} catch (error) {
console.error('Error fetching random quest:', error);
throw new Error('Failed to fetch a random quest.');
}
};

initializeGame = async () => {
try {
this.quest = await this.getRandomQuest();
this.maxAttempts = this.quest.quest.length;
} catch (error) {
console.error('Error initializing game:', error);
throw new Error('Failed to initialize the game.');
}
};

displayBoard = () => {
const emojiStages = ['😐', '😕', '😟', '😧', '😢', '😨', '😵'];
let board = `*Current Stage:* ${emojiStages[this.currentStage]}
%==========
||
|   ${emojiStages[this.currentStage]}
|   ${this.currentStage >= 3 ? '/' : ''}${this.currentStage >= 4 ? '|' : ''}${this.currentStage >= 5 ? '\\' : ''}
|   ${this.currentStage >= 1 ? '/' : ''}${this.currentStage >= 2 ? '\\' : ''}
|
|
==========%
*Clue:* ${this.quest.clue}`;
return board.replaceAll('%', '```');
};

displayWord = () => this.quest.quest.split('').map((char) => (this.guesses.includes(char) ? `${char}` : '__')).join(' ');

makeGuess = (letter) => {
if (!this.isAlphabet(letter)) return 'invalid';
letter = letter.toLowerCase();
if (this.guesses.includes(letter)) return 'repeat';

this.guesses.push(letter);

if (!this.quest.quest.includes(letter)) {
this.currentStage = Math.min(
this.quest.quest.length,
this.currentStage + 1,
);
}

return this.checkGameOver() ? 'over' : this.checkGameWin() ? 'win' : 'continue';
};

isAlphabet = (letter) => /^[a-zA-Z]$/.test(letter);

checkGameOver = () => this.currentStage >= this.maxAttempts;

checkGameWin = () => [...new Set(this.quest.quest)].every((char) => this.guesses.includes(char));

getHint = () => `*Hint:* ${this.quest.quest}`;
}

exports.run = {
usage: ['hangman'],
hidden: ['hm'],
use: 'options',
category: 'games',
async: async (m, { func, mecha }) => {
mecha.hangman = mecha.hangman || {};
let [action, inputs] = m.args;

try {
switch (action) {
case 'end':
if (mecha.hangman[m.chat] && mecha.hangman[m.chat].sessionId === m.sender) {
delete mecha.hangman[m.chat];
await m.reply('Successfully exit Hangman session. 👋');
} else {
await m.reply('There is no Hangman session in progress or you are not the player.');
}
break;

case 'start':
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (mecha.hangman[m.chat]) {
await m.reply(`The Hangman session is already underway. Use ${m.prefix}hangman *end* to end the session.`);
} else {
mecha.hangman[m.chat] = new HangmanGame(m.sender);
const gameSession = mecha.hangman[m.chat];
await gameSession.initializeGame();
await m.reply(`Hangman session begins. 🎉\n\n*Session ID:* ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Guess the Word:*\n${gameSession.displayWord()}\n\nSend letter to guess, example: *${m.prefix}hangman guess a*`);
}
break;

case 'guess':
if (mecha.hangman[m.chat]) {
if (!inputs || !/^[a-zA-Z]$/.test(inputs)) {
await m.reply(`Enter the letter you want to guess after *guess*. Example: *${m.prefix}hangman guess a*`);
return;
}

const gameSession = mecha.hangman[m.chat];
const userGuess = inputs.toLowerCase();
const result = gameSession.makeGuess(userGuess);

const messages = {
invalid: 'Masukkan surat yang valid.',
repeat: 'Anda sudah menebak surat ini sebelumnya. Coba surat yang lain.',
continue: `*Tebak Huruf:*\n${gameSession.guesses.join(', ')}\n${gameSession.displayBoard()}\n\n*Tebak Kata:*\n${gameSession.displayWord()}\n \n*Percobaan Tersisa:* ${gameSession.maxAttempts - gameSession.currentStage}`,
over: `Permainan telah berakhir! Kamu kalah. Kata yang benar adalah *${gameSession.quest.quest}*. 💀`,
win: 'Selamat! Anda menang dalam permainan Hangman. 🎉',
};

await m.reply(`${messages[result]}`);

if (result === 'over' || result === 'win') {
delete mecha.hangman[m.chat];
}
} else {
await m.reply('There are no Hangman sessions in progress. Use *start* to start the session.');
}
break;

case 'hint':
if (mecha.hangman[m.chat]) {
const gameSession = mecha.hangman[m.chat];
await m.reply(gameSession.getHint());
} else {
await m.reply('There are no Hangman sessions in progress. Use *start* to start the session.');
}
break;

case 'help':
await m.reply(`*H A N G M A N - G A M E S*\n\n*Commands:*\n- *${m.prefix}hangman start :* Starts the Hangman game.\n- *${m.prefix}hangman end :* Exits the game session.\n- *${m.prefix}hangman guess [letter] :* Guess the letter in a word.\n- *${m.prefix}hangman hint :* Get a word clue.`);
break;

default:
await m.reply(`Invalid action. Use ${m.prefix}hangman *help* to see how to use the command.`);
}
} catch (error) {
console.error('Error in hangman handler:', error);
await m.reply('An error occurred in handling the Hangman game. Please try again.');
}
}
}