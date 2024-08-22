exports.run = {
usage: ['chess'],
hidden: ['c'],
use: 'options',
category: 'games',
async: async (m, { func, mecha }) => {
try {
const { Chess } = require('chess.js');
const feature = m.args && (m.args[0] || '').toLowerCase();
if (feature === 'create') {
if (!m.isGc) return m.reply(global.mess.group)
global.db.chess[m.chat] = {
id: m.chat,
fen: null,
currentTurn: null,
status: 'waiting',
players: []
};
if (global.db.chess[m.chat].status !== 'waiting') return mecha.reply(m.chat, 'Permainan sudah dimulai.', m);
return mecha.reply(m.chat, `Room berhasil dibuat, ketik *${m.cmd} join* untuk bergabung.`, m);
} else if (feature === 'join') {
if (!m.isGc) return m.reply(global.mess.group)
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (!global.db.chess[m.chat]) return m.reply('Belum ada sesi permainan.');
const gameData = global.db.chess[m.chat];
const senderId = m.sender;
const joinedPlayers = gameData?.players || [];
if (joinedPlayers.includes(senderId)) {
return mecha.reply(m.chat, 'Kamu sudah bergabung dalam permainan ini.', m);
}
if (gameData.status !== 'waiting') {
return mecha.reply(m.chat, 'Tidak ada permainan catur yang sedang menunggu.', m);
}
if (gameData.players.length >= 2) {
return mecha.reply(m.chat, 'Pemain sudah mencukupi.\nPermainan otomatis dimulai.', m);
}
gameData.players.push(senderId);
if (gameData.players.length === 2) {
gameData.status = 'ready';
const joinedPlayersList = gameData.players.map(playerId => `@${playerId.split('@')[0]}`).join('\n');
return mecha.reply(m.chat, `*Pemain yang telah bergabung:*\n${joinedPlayersList}\n\nSilakan gunakan *${m.prefix}chess start* untuk memulai permainan.`, m, { mentions: gameData.players })
} else {
return mecha.reply(m.chat, 'Kamu telah bergabung dalam permainan catur, menunggu pemain lain untuk bergabung.', m);
}
} else if (feature === 'start') {
if (!m.isGc) return m.reply(global.mess.group)
if (!global.db.chess[m.chat]) return m.reply('Belum ada sesi permainan.');
const gameData = global.db.chess[m.chat];
const senderId = m.sender;
if (gameData.status !== 'ready') {
return mecha.reply(m.chat, 'Tidak dapat memulai permainan. tunggu hingga dua pemain bergabung.', m);
}
gameData.status = 'playing';
if (gameData.players.length === 2) {
await mecha.reply(m.chat, `Chess telah dikirimkan ke chat ${gameData.players.map(playerId => '@' + playerId.split('@')[0]).join(' dan ')}\n\nSilahkan selesaikan catur di chat masing²\nklik wa.me/${m.bot.split('@')[0]}`, m)
const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
gameData.fen = fen;
gameData.currentTurn = gameData.players[0];
const encodedFen = encodeURIComponent(fen);
const giliran = `Giliran @${gameData.currentTurn.split('@')[0]}`;
const flipParam = senderId == gameData.players[0] ? '&flip=true' : '';
//const flipParam = senderId === gameData.players[0] ? '' : '&flip=true';
const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`;
await mecha.sendMessage(gameData.currentTurn, {image: {url: boardUrl}, caption: giliran, mentions: [gameData.currentTurn]}, {quoted: m, ephemeralExpiration: m.expiration});
await mecha.sendMessage(m.chat, {text: 'Menunggu lawan bergerak...'}, {quoted: m, ephemeralExpiration: m.expiration})
return;
} else {
return mecha.reply(m.chat, 'Kamu telah bergabung dalam permainan catur, menunggu pemain lain untuk bergabung.', m);
}
} else if (feature === 'delete') {
if (!m.isGc) return m.reply(global.mess.group)
if (!global.db.chess[m.chat]) return m.reply('Belum ada sesi permainan.');
if (!global.db.chess[m.chat].players.includes(m.sender)) return m.reply(`Anda tidak bisa menghapus sesi chess karena bukan pemain!`)
delete global.db.chess[m.chat];
return mecha.reply(m.chat, 'Permainan catur berhasil dihapus.', m);
} else if (m.args[0] && m.args[1]) {
if (!m.isPc) return m.reply(global.mess.private)
const gameData = Object.values(global.db.chess).find(v => v.players.includes(m.sender));
const senderId = m.sender;
if (gameData.status !== 'playing') {
return mecha.reply(m.chat, 'Permainan belum dimulai.', m);
}
if (gameData.currentTurn !== senderId) {
return mecha.reply(m.chat, 'Sekarang bukan giliran kamu untuk bergerak.', m);
}
const chess = new Chess(gameData.fen);
if (chess.isCheckmate()) {
return mecha.reply(m.chat, '⚠️ *Checkmate.*', m);
}
if (chess.isDraw()) {
return mecha.reply(m.chat, '⚠️ *Draw.*', m);
}
if (chess.isGameOver()) {
return mecha.reply(m.chat, '⚠️ *Game Over.*', m);
}
const [from, to] = m.args;
try {
chess.move({ from: from.toLowerCase(), to: to.toLowerCase(), promotion: 'q' });
} catch (e) {
console.error(e)
return mecha.reply(m.chat, '❌ *Langkah tidak valid.*', m);
}
gameData.fen = chess.fen();
const currentTurnIndex = gameData.players.indexOf(gameData.currentTurn);
const nextTurnIndex = (currentTurnIndex + 1) % 2;
gameData.currentTurn = gameData.players[nextTurnIndex];
const encodedFen = encodeURIComponent(chess.fen());
const giliran = `Giliran @${gameData.currentTurn.split('@')[0]}\n\n${chess.getComment() || ''}`;
const flipParam = senderId == gameData.players[0] ? '&flip=true' : '';
//const flipParam = senderId === gameData.players[0] ? '' : '&flip=true';
const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`;
await mecha.sendMessage(m.chat, {text: 'Menunggu lawan bergerak...'}, {quoted: m, ephemeralExpiration: m.expiration})
await mecha.sendMessage(gameData.currentTurn, {image: {url: boardUrl}, caption: giliran, mentions: [gameData.currentTurn]}, {quoted: m, ephemeralExpiration: m.expiration});
chess.deleteComment();
return;
} else if (feature === 'help') {
let txt = `*Perintah Permainan Catur:*

*${m.prefix}chess create* - mulai permainan catur
*${m.prefix}chess join* - bergabung dalam permainan catur yang sedang menunggu
*${m.prefix}chess start* - memulai permainan catur jika ada dua pemain yang sudah bergabung
*${m.prefix}chess delete* - menghentikan permainan catur
*${m.prefix}chess [dari] [ke]* - melakukan langkah dalam permainan catur

*Contoh:*
Ketik *${m.prefix}chess create* untuk memulai permainan catur.
Ketik *${m.prefix}chess join* untuk bergabung dalam permainan catur yang sedang menunggu.`
return mecha.reply(m.chat, txt, m);
} else {
return mecha.reply(m.chat, `Perintah tidak valid. Gunakan *${m.prefix}chess help* untuk melihat bantuan.`, m);
}
} catch (e) {
let err = String(e)
if (err.includes('Cannot find module \'chess.js\'')) return m.reply('Module chess.js belum di install.\n> kirim `$ npm i chess.js` untuk menginstall module')
}
}
}