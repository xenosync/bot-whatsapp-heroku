exports.run = {
usage: ['petakbom', 'delpetakbom'],
category: 'games',
async: async (m, { func, mecha }) => {
switch (m.command) {
case 'petakbom':
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
if (m.sender in global.db.petakbom) return m.reply(`Game mu masih belum terselesaikan, lanjutkan yukk\n\n${global.db.petakbom[m.sender].board.join('')}\n\nKirim ${m.prefix}delpetakbom untuk menghapus game petak bom`);
function shuffle(array) {
return array.sort(() => Math.random() - 0.5);
}
let hadiah = func.randomNomor(3000, 5000)
global.db.petakbom[m.sender] = {
petak: shuffle([0, 0, 0, 2, 0, 2, 0, 2, 0, 0]),
board: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
bomb: 3,
lolos: 7,
pick: 0,
hadiah: hadiah,
nyawa: ["❤️", "❤️", "❤️"]
};
let teks = `PETAK BOM

${global.db.petakbom[m.sender].board.join('')}

Pilih lah nomor tersebut! dan jangan sampai terkena Bom!
Bomb: ${global.db.petakbom[m.sender].bomb}
Nyawa: ${global.db.petakbom[m.sender].nyawa.join('')}`
mecha.reply(m.chat, teks, m)
break
case 'delpetakbom':
if (!(m.sender in global.db.petakbom)) return m.reply(`kamu sedang tidak bermain petakbom!`)
delete global.db.petakbom[m.sender];
m.reply(`Berhasil menghapus game petak bomb`)
break
default:
}
},
main: async (m, { func, mecha }) => {
// FUNCTION PETAK BOMB BY SURYA
let pilih = "🌀", bomb = "💣";
if (m.sender in global.db.petakbom) {
let database = global.db.petakbom[m.sender];
if (!/^[1-9]|10$/i.test(m.budy) && !m.isPrefix) return !0;//m.reply(`Masukkan angka dengan benar!\n\n*PETAK BOMB*\n\n${database.board.join('')}`)
if (database.petak[parseInt(m.budy) - 1] === 1) return !0;
if (database.petak[parseInt(m.budy) - 1] === 2) {
database.board[parseInt(m.budy) - 1] = bomb;
database.pick++;
database.bomb--;
database.nyawa.pop();
let brd = database.board;
if (database.nyawa.length < 1) {
await m.reply(`GAME TELAH BERAKHIR\nKamu terkena bomb\n\n ${brd.join('')}\n\nTerpilih: ${database.pick}\nNyawamu habis... balance -${database.hadiah}`);
global.db.users[m.sender].balance -= database.hadiah
delete global.db.petakbom[m.sender];
} else await m.reply(`PETAK BOM\n\nKamu terkena bomb\n ${brd.join('')}\n\nTerpilih: ${database.pick}\nSisa nyawa: ${database.nyawa}`);
return !0;
}
if (database.petak[parseInt(m.budy) - 1] === 0) {
database.petak[parseInt(m.budy) - 1] = 1;
database.board[parseInt(m.budy) - 1] = pilih;
database.pick++;
database.lolos--;
let brd = database.board;
if (database.lolos < 1) {
await m.reply(`Kamu berhasil menebak semuanya🥳\n${brd.join('')}\n\nTerpilih: ${database.pick}\nSisa nyawa: ${database.nyawa}\nBomb: ${database.bomb}\nHadiah: $${database.hadiah} balance`);
global.db.users[m.sender].balance += database.hadiah
global.db.users[m.sender].game.petakbom += 1
delete global.db.petakbom[m.sender];
} else m.reply(`PETAK BOM\n\n${brd.join('')}\n\nTerpilih: ${database.pick}\nSisa nyawa: ${database.nyawa}\nBomb: ${database.bomb}`);
}
}
}
}