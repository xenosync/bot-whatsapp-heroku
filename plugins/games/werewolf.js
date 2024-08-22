const toMs = require('ms')
const jimp = require('jimp')

exports.run = {
usage: ['werewolf'],
hidden: ['ww', 'w'],
use: 'options',
category: 'games',
async: async (m, { func, mecha, setting }) => {
try {
const werewolf = global.db.werewolf;
const data = werewolf[m.chat];
const timeout = setting.gamewaktu;
const time_vote = timeout / 2;
const value = m.args && (m.args[0] || '').toLowerCase();
const target = m.args && (m.args[1] || '').replace(/[^0-9]/g, '');

// [ Thumbnail ]
let thumb = "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg";
let thumb1 = "https://user-images.githubusercontent.com/72728486/235344562-4677d2ad-48ee-419d-883f-e0ca9ba1c7b8.jpg";
let thumb2 = "https://user-images.githubusercontent.com/72728486/235344861-acdba7d1-8fce-41b8-adf6-337c818cda2b.jpg";
let thumb3 = "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg";
let thumb4 = "https://user-images.githubusercontent.com/72728486/235354619-6ad1cabd-216c-4c7c-b7c2-3a564836653a.jpg";
let thumb5 = "https://user-images.githubusercontent.com/72728486/235365156-cfab66ce-38b2-4bc7-90d7-7756fc320e06.jpg";
let thumb6 = "https://user-images.githubusercontent.com/72728486/235365148-35b8def7-c1a2-451d-a2f2-6b6a911b37db.jpg";

var a;
var b;
var d;
var e;
var f;
var textnya;
var idd;
var room;

const resize = async (image, width, height) => {
const read = await jimp.read(image);
const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
return data;
};

async function delay(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

function emoji_role(role) {
if (role === "warga") {
return "👩🏻‍🦳";
} else if (role === "seer") {
return "👳🏻‍♀️";
} else if (role === "guardian") {
return "👼🏻";
} else if (role === "sorcerer") {
return "🔮";
} else if (role === "werewolf") {
return "🐺";
} else {
return "";
}
}

const findObject = (obj = {}, key, value) => {
const result = [];
const recursiveSearch = (obj = {}) => {
if (!obj || typeof obj !== "object") {
return;
}
if (obj[key] === value) {
result.push(obj);
}
Object.keys(obj).forEach(function(k) {
recursiveSearch(obj[k]);
});
};
recursiveSearch(obj);
return result;
};

// Sesi
const sesi = (from, data) => {
if (!data[from]) return false;
return data[from];
};

// Memastikan player tidak dalam sesi game apapun
const playerOnGame = (sender, data) => {
let result = findObject(data, "id", sender);
let index = false;
if (result.length === 0) {
return index;
} else {
index = true;
}
return index;
};

// cek apakah player sudah dalam room
const playerOnRoom = (sender, from, data) => {
let result = findObject(data, "id", sender);
let index = false;
if (result.length > 0 && result[0].sesi === from) {
index = true;
} else {
return index;
}
return index;
};

// get data player
const dataPlayer = (sender, data) => {
let result = findObject(data, "id", sender);
let index = false;
if (result.length > 0 && result[0].id === sender) {
index = result[0];
} else {
return index;
}
return index;
};

// get data player by id
const dataPlayerById = (id, data) => {
let result = findObject(data, "number", id);
let index = false;
if (result.length > 0 && result[0].number === id) {
index = result[0];
} else {
return index;
}
return index;
};

// keluar game
const playerExit = (from, id, data) => {
room = sesi(from, data);
if (!room) return false;
const indexPlayer = room.player.findIndex((i) => i.id === id);
room.player.splice(indexPlayer, 1);
for (let [index, number] of room.player.entries()) {
room.player[index].number = index + 1
}
};

// get player id
const getPlayerById = (from, sender, id, data) => {
room = sesi(from, data);
if (!room) return false;
const indexPlayer = room.player.findIndex((i) => i.number === id);
if (indexPlayer === -1) return false;
return {
index: indexPlayer,
sesi: room.player[indexPlayer].sesi,
db: room.player[indexPlayer],
};
};

// get player id 2
const getPlayerById2 = (sender, id, data) => {
let result = findObject(data, "id", sender);
if (result.length > 0 && result[0].id === sender) {
let from = result[0].sesi;
room = sesi(from, data);
if (!room) return false;
const indexPlayer = room.player.findIndex((i) => i.number === id);
if (indexPlayer === -1) return false;
return {
index: indexPlayer,
sesi: room.player[indexPlayer].sesi,
db: room.player[indexPlayer],
};
}
};

// werewolf kill
const killWerewolf = (sender, id, data) => {
let result = getPlayerById2(sender, id, data);
if (!result) return false;
let { index, sesi, db } = result;
if (data[sesi].player[index].number === id) {
if (db.effect.includes("guardian")) {
data[sesi].guardian.push(parseInt(id));
data[sesi].dead.push(parseInt(id));
} else if (!db.effect.includes("guardian")) {
data[sesi].dead.push(parseInt(id));
}
}
};

// seer dreamy
const dreamySeer = (sender, id, data) => {
let result = getPlayerById2(sender, id, data);
if (!result) return false;
let { index, sesi, db } = result;
if (data[sesi].player[index].role === "werewolf") {
data[sesi].seer = true;
}
return data[sesi].player[index].role;
};

// seer dreamy
const sorcerer = (sender, id, data) => {
let result = getPlayerById2(sender, id, data);
if (!result) return false;
let { index, sesi, db } = result;
return data[sesi].player[index].role;
};

// get data dead player
const getDeadPlayer = (sender, id, data) => {
let result = getPlayerById2(sender, id, data);
if (!result) return false;
let { index, sesi, db } = result;
return data[sesi].dead.some((v) => v == id);
};

// guardian protect
const protectGuardian = (sender, id, data) => {
let result = getPlayerById2(sender, id, data);
if (!result) return false;
let { index, sesi, db } = result;
data[sesi].player[index].effect.push("guardian");
};

// pengacakan role
const roleShuffle = (array) => {
let currentIndex = array.length,
randomIndex;
while (currentIndex != 0) {
randomIndex = Math.floor(Math.random() * currentIndex);
currentIndex--;
[array[currentIndex], array[randomIndex]] = [
array[randomIndex],
array[currentIndex],
];
}
return array;
};

// memberikan role ke player
const roleChanger = (from, id, role, data) => {
room = sesi(from, data);
if (!room) return false;
var index = room.player.findIndex((i) => i.id === id);
if (index === -1) return false;
room.player[index].role = role;
};

// memberikan peran ke semua player
const roleAmount = (from, data) => {
const result = sesi(from, data);
if (!result) return false;
if (result.player.length == 4) {
return {
werewolf: 1,
seer: 1,
guardian: 1,
warga: 1,
sorcere: 0,
};
} else if (result.player.length == 5) {
return {
werewolf: 1,
seer: 1,
guardian: 1,
warga: 3,
sorcere: 0,
};
} else if (result.player.length == 6) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 2,
sorcere: 0,
};
} else if (result.player.length == 7) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 3,
sorcere: 0,
};
} else if (result.player.length == 8) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 4,
sorcere: 0,
};
} else if (result.player.length == 9) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 4,
sorcere: 1,
};
} else if (result.player.length == 10) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 5,
sorcere: 1,
};
} else if (result.player.length == 11) {
return {
werewolf: 2,
seer: 1,
guardian: 2,
warga: 5,
sorcere: 1,
};
} else if (result.player.length == 12) {
return {
werewolf: 2,
seer: 1,
guardian: 2,
warga: 6,
sorcere: 1,
};
} else if (result.player.length == 13) {
return {
werewolf: 2,
seer: 1,
guardian: 1,
warga: 7,
sorcere: 1,
};
} else if (result.player.length == 14) {
return {
werewolf: 2,
seer: 2,
guardian: 2,
warga: 7,
sorcere: 1,
};
} else if (result.player.length == 15) {
return {
werewolf: 3,
seer: 2,
guardian: 3,
warga: 6,
sorcere: 1,
};
}
};

const roleGenerator = (from, data) => {
room = sesi(from, data);
if (!room) return false;
var role = roleAmount(from, data);
for (var i = 0; i < role.werewolf; i++) {
var player = room.player.filter((x) => x.role === false);
var list = roleShuffle(player);
if (list.length === 0) return false;
var random = Math.floor(Math.random() * list.length);
roleChanger(from, list[random].id, "werewolf", data);
}
for (var i = 0; i < role.seer; i++) {
var player = room.player.filter((x) => x.role === false);
var list = roleShuffle(player);
if (list.length === 0) return false;
var random = Math.floor(Math.random() * list.length);
roleChanger(from, list[random].id, "seer", data);
}
for (var i = 0; i < role.guardian; i++) {
var player = room.player.filter((x) => x.role === false);
var list = roleShuffle(player);
if (list.length === 0) return false;
var random = Math.floor(Math.random() * list.length);
roleChanger(from, list[random].id, "guardian", data);
}
for (var i = 0; i < role.warga; i++) {
var player = room.player.filter((x) => x.role === false);
var list = roleShuffle(player);
if (list.length === 0) return false;
var random = Math.floor(Math.random() * list.length);
roleChanger(from, list[random].id, "warga", data);
}
for (var i = 0; i < role.sorcere; i++) {
var player = room.player.filter((x) => x.role === false);
var list = roleShuffle(player);
if (list.length === 0) return false;
var random = Math.floor(Math.random() * list.length);
roleChanger(from, list[random].id, "sorcerer", data);
}
shortPlayer(from, data);
};

// add cooldown
const addTimer = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.cooldown = Date.now() + toMs(timeout + "s");
};

// merubah status room, dalam permainan
const startGame = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.status = true;
};

// rubah hari
const changeDay = (from, data) => {
room = sesi(from, data);
if (!room) return false;
if (room.time === "pagi") {
room.time = "voting";
} else if (room.time === "malem") {
room.time = "pagi";
room.day += 1;
} else if (room.time === "voting") {
room.time = "malem";
}
};

// hari voting
const dayVoting = (from, data) => {
room = sesi(from, data);
if (!room) return false;
if (room.time === "malem") {
room.time = "voting";
} else if (room.time === "pagi") {
room.time = "voting";
}
};

// voting
const vote = (from, id, sender, data) => {
room = sesi(from, data);
if (!room) return false;
const idGet = room.player.findIndex((i) => i.id === sender);
if (idGet === -1) return false;
const indexPlayer = room.player.findIndex((i) => i.number === id);
if (indexPlayer === -1) return false;
if (idGet !== -1) {
room.player[idGet].isvote = true;
}
room.player[indexPlayer].vote += 1;
};

// hasil voting
const voteResult = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
if (room.player[0].vote === 0) return 0;
if (room.player[0].vote === room.player[1].vote) return 1;
return room.player[0];
};

// vote killing
const voteKill = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
if (room.player[0].vote === 0) return 0;
if (room.player[0].vote === room.player[1].vote) return 1;
room.player[0].isdead = true;
};

// voting reset
const resetVote = (from, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.player.length; i++) {
room.player[i].vote = 0;
}
};

const voteDone = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.voting = false;
};

const voteStart = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.voting = true;
};

// clear vote
const clearAllVote = (from, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.player.length; i++) {
room.player[i].vote = 0;
room.player[i].isvote = false;
}
};

// clearAll
const clearAll = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.dead = [];
room.seer = false;
room.guardian = [];
room.voting = false;
};

// clear all status player
const clearAllStatus = (from, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.player.length; i++) {
room.player[i].effect = [];
}
};

const skillOn = (from, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.player.length; i++) {
room.player[i].status = false;
}
};

const skillOff = (from, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.player.length; i++) {
room.player[i].status = true;
}
};

const playerHidup = (data) => {
const hasil = data.player.filter((x) => x.isdead === false);
return hasil.length;
};

const playerMati = (data) => {
const hasil = data.player.filter((x) => x.isdead === true);
return hasil.length;
};

// get player win
const getWinner = (from, data) => {
room = sesi(from, data);
if (!room) return false;
var ww = 0;
var orang_baek = 0;
for (let i = 0; i < room.player.length; i++) {
if (room.player[i].isdead === false) {
if (room.player[i].role === "werewolf" || room.player[i].role === "sorcerer") {
ww += 1;
} else if (room.player[i].role === "warga" || room.player[i].role === "guardian" || room.player[i].role === "seer") {
orang_baek += 1;
}
}
}
if (room.voting) {
b = voteResult(from, data);
if (b != 0 && b != 1) {
if (b.role === "werewolf" || b.role === "sorcerer") {
ww -= 1;
} else if (b.role === "warga" || b.role === "seer" || b.role === "guardian") {
orang_baek -= 1;
}
}
}
if (ww === 0) {
room.iswin = true;
return {
voting: room.voting,
status: true
};
} else if (ww === orang_baek) {
room.iswin = false;
return {
voting: room.voting,
status: false
};
} else if (orang_baek === 0) {
room.iswin = false;
return {
voting: room.voting,
status: false
};
} else {
return {
voting: room.voting,
status: null
};
}
};

// shorting
const shortPlayer = (from, data) => {
room = sesi(from, data);
if (!room) return false;
room.player.sort((a, b) => a.number - b.number);
};

// werewolf killing
const killww = (from, id, data) => {
room = sesi(from, data);
if (!room) return false;
for (let i = 0; i < room.dead.length; i++) {
idd = getPlayerById(from, room.player[0].id, room.dead[i], data);
if (!idd) return false;
if (room.player[idd.index].effect.includes("guardian")) return;
room.player[idd.index].isdead = true;
}
};

const pagii = (data) => {
if (data.dead.length < 1) {
return `*W E R E W O L F - G A M E*\n\nMentari telah terbit, tidak ada korban berjatuhan malam ini, warga kembali melakukan aktifitasnya seperti biasa.\n${time_vote} detik tersisa sebelum waktu penentuan, para warga dipersilahkan untuk berdiskusi\n*Hari ke ${data.day}*`;
} else {
a = '';
d = '';
e = [];
f = [];
for (let i = 0; i < data.dead.length; i++) {
b = data.player.findIndex((x) => x.number === data.dead[i]);
if (data.player[b].effect.includes("guardian")) {
e.push(data.player[b].id);
} else {
f.push(data.player[b].id);
}
}
for (let i = 0; i < f.length; i++) {
if (i === f.length - 1) {
if (f.length > 1) {
a += ` dan @${f[i].split('@')[0]}`;
} else {
a += `@${f[i].split('@')[0]}`;
}
} else if (i === f.length - 2) {
a += `@${f[i].split('@')[0]}`;
} else {
a += `@${f[i].split('@')[0]}, `;
}
}
for (let i = 0; i < e.length; i++) {
if (i === e.length - 1) {
if (e.length > 1) {
d += ` dan @${e[i].split('@')[0]}`;
} else {
d += `@${e[i].split('@')[0]}`;
}
} else if (i === e.length - 2) {
d += `@${e[i].split('@')[0]}`;
} else {
d += `@${e[i].split('@')[0]}, `;
}
}
textnya = `*W E R E W O L F - G A M E*\n\nPagi telah tiba, warga desa menemukan ${data.dead.length > 1 ? 'beberapa' : '1'} mayat di tumpukan puing dan darah berceceran. ${a ? a + " telah mati! " : ""}${d.length > 1 ? d + ' hampir dibunuh, namun *Guardian Angel* berhasil melindunginya.' : ""}\n\nTak terasa hari sudah siang, matahari tepat di atas kepala, terik panas matahari membuat suasana menjadi riuh, warga desa mempunyai ${time_vote} detik untuk berdiskusi\n*Hari ke ${data.day}*`;
return textnya;
}
};

async function pagi(x, data) {
skillOff(x.room, data)
let ment = [];
for (let i = 0; i < x.player.length; i++) {
ment.push(x.player[i].id);
}
shortPlayer(x.room, data);
killww(x.room, x.dead, data);
shortPlayer(x.room, data);
changeDay(x.room, data);
return await mecha.sendMessage(x.room, {
text: pagii(x),
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb1, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb1
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration});
}

async function voting(x, data) {
let ment = [];
let poll = [];
voteStart(x.room, data)
textnya = `*W E R E W O L F - G A M E*\n\nSenja telah tiba. Seluruh warga berkumpul di balai desa untuk memilih siapa yang akan dieksekusi. Sebagian warga terlihat sibuk menyiapkan alat penyiksaan untuk malam ini. Kalian mempunyai waktu selama ${timeout} detik untuk memilih! Hati-hati, ada penghianat diantara kalian!\n\n*L I S T - P L A Y E R*:\n`;
shortPlayer(x.room, data);
for (let i = 0; i < x.player.length; i++) {
textnya += `(${x.player[i].number}) @${x.player[i].id.split('@')[0]} ${x.player[i].isdead === true ? '☠️' : ''}\n`;
poll.push(`ww vote ${i + 1}`);
ment.push(x.player[i].id);
}
dayVoting(x.room, data);
clearAll(x.room, data);
clearAllStatus(x.room, data);
await mecha.sendMessage(x.room, {
text: textnya,
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb2, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb2
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration}).then(async () => {
return await mecha.sendPoll(x.room, '*SILAHKAN VOTE PLAYER DIBAWAH*', poll)
})
}

async function malam(x, data) {
var hasil_vote = voteResult(x.room, data);
if (hasil_vote === 0) {
textnya = `*W E R E W O L F - G A M E*\n\nTerlalu bimbang menentukan pilihan. Warga pun pulang ke rumah masing-masing, tidak ada yang dieksekusi hari ini. Bulan bersinar terang, malam yang mencekam telah datang. Semoga tidak ada yang mati malam ini. Pemain malam hari: kalian punya ${timeout} detik untuk beraksi!`;
return mecha.sendMessage(x.room, {
text: textnya,
contextInfo: setting.fakereply ? {
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb3, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb3
}
} : {}
}, {ephemeralExpiration: m.expiration}).then(() => {
changeDay(x.room, data);
voteDone(x.room, data);
resetVote(x.room, data);
clearAllVote(x.room, data);
if (getWinner(x.room, data).status != null)
return win(x, 1, data);
});
} else if (hasil_vote === 1) {
textnya = `*W E R E W O L F - G A M E*\n\nWarga desa telah memilih, namun hasilnya seri.\n\nBintang memancarkan cahaya indah malam ini, warga desa beristirahat di kediaman masing masing. Pemain malam hari: kalian punya ${timeout} detik untuk beraksi!`;
return mecha.sendMessage(x.room, {
text: textnya,
contextInfo: setting.fakereply ? {
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb3, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb3
}
} : {}
}, {ephemeralExpiration: m.expiration}).then(() => {
changeDay(x.room, data);
voteDone(x.room, data);
resetVote(x.room, data);
clearAllVote(x.room, data);
if (getWinner(x.room, data).status != null)
return win(x, 1, data);
});
} else if (hasil_vote != 0 && hasil_vote != 1) {
if (hasil_vote.role === "werewolf") {
textnya = `*W E R E W O L F - G A M E*\n\nWarga desa telah memilih dan sepakat @${hasil_vote.id.split('@')[0]} dieksekusi mati.

@${hasil_vote.id.split('@')[0]} adalah ${hasil_vote.role} ${emoji_role(hasil_vote.role)}`;
voteKill(x.room, data);
let ment = [];
ment.push(hasil_vote.id);
return await mecha.sendMessage(x.room, {
text: textnya,
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb4, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb4
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration}).then(() => {
changeDay(x.room, data);
voteDone(x.room, data);
resetVote(x.room, data);
clearAllVote(x.room, data);
if (getWinner(x.room, data).status != null)
return win(x, 1, data);
});
} else {
textnya = `*W E R E W O L F - G A M E*\n\nWarga desa telah memilih dan sepakat @${hasil_vote.id.split('@')[0]} dieksekusi mati.

@${hasil_vote.id.split('@')[0]} adalah ${hasil_vote.role} ${emoji_role(hasil_vote.role)}

Bulan bersinar terang malam ini, warga desa beristirahat di kediaman masing masing. Pemain malam hari: kalian punya ${timeout} detik untuk beraksi!`;
voteKill(x.room, data);
let ment = [];
ment.push(hasil_vote.id);
return await mecha.sendMessage(x.room, {
text: textnya,
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb4, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb4
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration}).then(() => {
changeDay(x.room, data);
voteDone(x.room, data);
resetVote(x.room, data);
clearAllVote(x.room, data);
if (getWinner(x.room, data).status != null)
return win(x, 1, data);
});
}
}
}

async function skill(x, data) {
skillOn(x.room, data)
if (getWinner(x.room, data).status != null || x.win != null) {
return win(x, 1, data);
} else {
if (!x) return;
if (!x.player) return;
if (x.win != null) return;
let tok1 = '';
let tok2 = '';
let membernya = [];
let polling = [];
shortPlayer(x.room, data);
for (let i = 0; i < x.player.length; i++) {
tok1 += `(${x.player[i].number}) @${x.player[i].id.split('@')[0]}${x.player[i].isdead === true ? ' ☠️' : ''}\n`;
tok2 += `(${x.player[i].number}) @${x.player[i].id.split('@')[0]} ${x.player[i].role === 'werewolf' || x.player[i].role === 'sorcerer' ? (x.player[i].isdead === true ? '☠️' : x.player[i].role) : " "}\n`;
polling.push(`ww value ${i + 1}`)
membernya.push(x.player[i].id);
}
for (let i = 0; i < x.player.length; i++) {
if (x.player[i].role === "werewolf") {
if (x.player[i].isdead != true) {
textnya = `Silahkan pilih salah satu orang yang ingin kamu makan pada malam hari ini\n
*LIST PLAYER*:\n${tok2}`;
await mecha.sendMessage(x.player[i].id, {text: textnya, mentions: membernya}, {ephemeralExpiration: m.expiration}).then(async () => {
await mecha.sendPoll(x.player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'kill')))
});
}
} else if (x.player[i].role === "warga") {
if (x.player[i].isdead != true) {
textnya = `Sebagai seorang warga berhati-hatilah, mungkin kamu adalah target selanjutnya.\n
*LIST PLAYER*:\n${tok1}`;
await mecha.sendMessage(x.player[i].id, {text: textnya, mentions: membernya}, {ephemeralExpiration: m.expiration});
}
} else if (x.player[i].role === "seer") {
if (x.player[i].isdead != true) {
textnya = `Baiklah, siapa yang ingin kamu lihat peran nya kali ini.\n
*LIST PLAYER*:\n${tok1}`;
await mecha.sendMessage(x.player[i].id, {text: textnya, mentions: membernya}, {ephemeralExpiration: m.expiration}).then(async () => {
await mecha.sendPoll(x.player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'dreamy')))
});
}
} else if (x.player[i].role === "guardian") {
if (x.player[i].isdead != true) {
textnya = `Kamu adalah seorang *Guardian*, lindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n
*LIST PLAYER*:\n${tok1}`;
await mecha.sendMessage(x.player[i].id, {text: textnya, mentions: membernya}, {ephemeralExpiration: m.expiration}).then(async () => {
await mecha.sendPoll(x.player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'deff')))
});
}
} else if (x.player[i].role === "sorcerer") {
if (x.player[i].isdead != true) {
textnya = `Baiklah, lihat apa yang bisa kamu buat, silakan pilih 1 orang yang ingin kamu buka identitasnya\n
*LIST PLAYER*:\n${tok2}`;
await mecha.sendMessage(x.player[i].id, {text: textnya, mentions: membernya}, {ephemeralExpiration: m.expiration}).then(async () => {
await mecha.sendPoll(x.player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'sorcerer')))
});
}
}
}
}
}

async function win(x, t, data) {
const sesinya = x.room;
if (getWinner(x.room, data).status === false || x.iswin === false) {
textnya = `*W E R E W O L F - W I N*\n\nTEAM WEREWOLF\n`;
let ment = [];
let hadiah = func.randomNomor(5000, 20000)
for (let i = 0; i < x.player.length; i++) {
if (x.player[i].role === "sorcerer" || x.player[i].role === "werewolf") {
textnya += `${x.player[i].number}) @${x.player[i].id.split('@')[0]}\n *Role* : ${x.player[i].role}\n\n`;
global.db.users[x.player[i].id].balance += parseInt(hadiah);
global.db.users[x.player[i].id].game.werewolf += 1;
ment.push(x.player[i].id);
}
}
textnya += `Hadiah: $${hadiah} balance`
return await mecha.sendMessage(sesinya, {
text: textnya,
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb5, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb5
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration}).then(() => {
delete data[x.room];
});
} else if (getWinner(x.room, data).status === true) {
textnya = `*T E A M - W A R G A - W I N*\n\nTEAM WARGA\n`;
let ment = [];
let hadiah = func.randomNomor(5000, 15000)
for (let i = 0; i < x.player.length; i++) {
if (x.player[i].role === "warga" || x.player[i].role === "guardian" || x.player[i].role === "seer") {
textnya += `${x.player[i].number}) @${x.player[i].id.split('@')[0]}\n *Role* : ${x.player[i].role}\n\n`;
global.db.users[x.player[i].id].balance += parseInt(hadiah);
global.db.users[x.player[i].id].game.werewolf += 1;
ment.push(x.player[i].id);
}
}
textnya += `Hadiah: $${hadiah} balance`
return await mecha.sendMessage(sesinya, {
text: textnya,
contextInfo: setting.fakereply ? {
mentionedJid: ment,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb5, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb5
}
} : {mentionedJid: ment}
}, {ephemeralExpiration: m.expiration}).then(() => {
delete data[x.room];
});
}
}

// playing
async function run(id, data) {
while (getWinner(id, data).status === null) {
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await pagi(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(time_vote * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await voting(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(time_vote * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await malam(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await skill(sesi(id, data), data);
}
if (getWinner(id, data).status != null) break;
}
await win(sesi(id, data), 1, data);
}

async function run_vote(id, data) {
while (getWinner(id, data).status === null) {
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await voting(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await malam(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await skill(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await pagi(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) break;
}
await win(sesi(id, data), 1, data);
}

async function run_malam(id, data) {
while (getWinner(id, data).status === null) {
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await skill(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await pagi(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(time_vote * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await voting(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await malam(sesi(id, data), data);
}
if (getWinner(id, data).status != null) break;
}
await win(sesi(id, data), 1, data);
}

async function run_pagi(id, data) {
while (getWinner(id, data).status === null) {
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await pagi(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(time_vote * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await voting(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await malam(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await skill(sesi(id, data), data);
}
if (getWinner(id, data).status != null) {
win(getWinner(id, data), 1, data);
break;
} else {
await delay(timeout * 1000);
}
if (getWinner(id, data).status != null) break;
}
await win(sesi(id, data), 1, data);
}

/* COMMANDS WEREWOLF */
if (m.isGc) {
// [ Membuat Room ]
if (value === "create") {
if (m.chat in werewolf) return m.reply("Group masih dalam sesi permainan");
if (playerOnGame(m.sender, werewolf) === true) return m.reply("Kamu masih dalam sesi game");
werewolf[m.chat] = {
room: m.chat,
owner: m.sender,
status: false,
iswin: null,
cooldown: null,
day: 0,
time: "malem",
player: [],
dead: [],
voting: false,
seer: false,
guardian: [],
};
await mecha.reply(m.chat, `Room berhasil dibuat, ketik *${m.cmd} join* untuk bergabung`, m, {
expiration: m.expiration
});
// [ Join sesi permainan ]
} else if (value === "join") {
if (!werewolf[m.chat]) return m.reply("Belum ada sesi permainan");
if (werewolf[m.chat].status === true) return m.reply("Sesi permainan sudah dimulai");
if (werewolf[m.chat].player.length >= 15) return m.reply("Maaf jumlah player telah penuh");
if (playerOnRoom(m.sender, m.chat, werewolf) === true) return m.reply("Kamu sudah join dalam room ini");
if (playerOnGame(m.sender, werewolf) === true) return m.reply("Kamu masih dalam sesi game");
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
let data = {
id: m.sender,
number: werewolf[m.chat].player.length + 1,
sesi: m.chat,
status: false,
role: false,
effect: [],
vote: 0,
isdead: false,
isvote: false,
};
werewolf[m.chat].player.push(data);
let player = [];
let text = `*⌂ W E R E W O L F - P L A Y E R*\n`;
for (let i = 0; i < werewolf[m.chat].player.length; i++) {
text += `\n${werewolf[m.chat].player[i].number}) @${werewolf[m.chat].player[i].id.split('@')[0]}`;
player.push(werewolf[m.chat].player[i].id);
}
text += "\n\nJumlah player minimal adalah 5 dan maximal 12";
mecha.sendMessage(m.chat, {
text: text.trim(),
contextInfo: setting.fakereply ? {
mentionedJid: player,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb
}
} : {mentionedJid: player}
}, {quoted: m, ephemeralExpiration: m.expiration});

// [ Game Play ]
} else if (value === "start") {
if (!werewolf[m.chat]) return m.reply("Belum ada sesi permainan");
if (werewolf[m.chat].player?.length === 0) return m.reply("Room belum memiliki player");
if (werewolf[m.chat].player?.length < 5) return m.reply("Maaf jumlah player belum memenuhi syarat");
if (playerOnRoom(m.sender, m.chat, werewolf) === false) return m.reply("Kamu belum join dalam room ini");
if (werewolf[m.chat].cooldown > 0) {
if (werewolf[m.chat].time === "voting") {
clearAllVote(m.chat, werewolf);
addTimer(m.chat, werewolf);
return await run_vote(m.chat, werewolf);
} else if (werewolf[m.chat].time === "malem") {
clearAllVote(m.chat, werewolf);
addTimer(m.chat, werewolf);
return await run_malam(m.chat, werewolf);
} else if (werewolf[m.chat].time === "pagi") {
clearAllVote(m.chat, werewolf);
addTimer(m.chat, werewolf);
return await run_pagi(m.chat, werewolf);
}
}
if (werewolf[m.chat].status === true) return m.reply("Sesi permainan telah dimulai");
if (werewolf[m.chat].owner !== m.sender) return m.reply(`Hanya @${werewolf[m.chat].owner.split("@")[0]} yang dapat memulai permainan`);
let list1 = '';
let list2 = '';
let player = [];
let polling = [];
roleGenerator(m.chat, werewolf);
addTimer(m.chat, werewolf);
startGame(m.chat, werewolf);
for (let i = 0; i < werewolf[m.chat].player.length; i++) {
list1 += `(${werewolf[m.chat].player[i].number}) @${werewolf[m.chat].player[i].id.split('@')[0]}\n`;
list2 += `(${werewolf[m.chat].player[i].number}) @${werewolf[m.chat].player[i].id.split('@')[0]} ${werewolf[m.chat].player[i].role === 'werewolf' || werewolf[m.chat].player[i].role === 'sorcerer' ? '[' + werewolf[m.chat].player[i].role + ']' : ''}\n`;
player.push(werewolf[m.chat].player[i].id);
polling.push(`ww value ${i + 1}`);
}
for (let i = 0; i < werewolf[m.chat].player.length; i++) {
// [ Werewolf ]
if (werewolf[m.chat].player[i].role === "werewolf") {
if (werewolf[m.chat].player[i].isdead != true) {
let text = `Hai ${mecha.getName(werewolf[m.chat].player[i].id)}, Kamu telah dipilih untuk memerankan *Werewolf* ${emoji_role("werewolf")} pada permainan kali ini, silahkan pilih salah satu player yang ingin kamu makan pada malam hari ini\n\n*LIST PLAYER*:\n${list2}`;
await mecha.sendMessage(werewolf[m.chat].player[i].id, {text: text, mentions: player}).then(async () => {
await mecha.sendPoll(werewolf[m.chat].player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'kill')))
});
}

// [ villager ]
} else if (werewolf[m.chat].player[i].role === "warga") {
if (werewolf[m.chat].player[i].isdead != true) {
let text = `Hai ${mecha.getName(werewolf[m.chat].player[i].id)} Peran kamu adalah *Warga Desa* ${emoji_role("warga")}, tetap waspada, mungkin *Werewolf* akan memakanmu malam ini, silakan masuk kerumah masing masing.\n
*LIST PLAYER*:\n${list1}`;
await mecha.sendMessage(werewolf[m.chat].player[i].id, {text: text, mentions: player});
}

// [ Penerawangan ]
} else if (werewolf[m.chat].player[i].role === "seer") {
if (werewolf[m.chat].player[i].isdead != true) {
let text = `Hai ${mecha.getName(werewolf[m.chat].player[i].id)} Kamu telah terpilih untuk menjadi *Penerawang* ${emoji_role("seer")}. Dengan sihir yang kamu punya, kamu bisa mengetahui peran pemain pilihanmu.\n\n*LIST PLAYER*:\n${list1}`;
await mecha.sendMessage(werewolf[m.chat].player[i].id, {text: text, mentions: player}).then(async () => {
await mecha.sendPoll(werewolf[m.chat].player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'dreamy')))
});
}

// [ Guardian ]
} else if (werewolf[m.chat].player[i].role === "guardian") {
if (werewolf[m.chat].player[i].isdead != true) {
let text = `Hai ${mecha.getName(werewolf[m.chat].player[i].id)} Kamu terpilih untuk memerankan *Malaikat Pelindung* ${emoji_role('guardian')}, dengan kekuatan yang kamu miliki, kamu bisa melindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n\n*LIST PLAYER*:\n${list1}`;
await mecha.sendMessage(werewolf[m.chat].player[i].id, {text: text, mentions: player}).then(async () => {
await mecha.sendPoll(werewolf[m.chat].player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'deff')))
});
}

// [ Sorcerer ]
} else if (werewolf[m.chat].player[i].role === "sorcerer") {
if (werewolf[m.chat].player[i].isdead != true) {
let text = `Hai ${mecha.getName(werewolf[m.chat].player[i].id)} Kamu terpilih sebagai Penyihir ${emoji_role('sorcerer')}, dengan kekuasaan yang kamu punya, kamu bisa membuka identitas para player, silakan pilih 1 orang yang ingin kamu buka identitasnya\n\n*LIST PLAYER*:\n${list2}`;
await mecha.sendMessage(werewolf[m.chat].player[i].id, {text: text, mentions: player}).then(async () => {
await mecha.sendPoll(werewolf[m.chat].player[i].id, '*SILAHKAN VOTE PLAYER DIBAWAH*', polling.map(v => v.replace('value', 'sorcerer')))
});
}
}
}
await mecha.sendMessage(m.chat, {
text: "*W E R E W O L F - G A M E*\n\nGame telah dimulai, para player akan memerankan perannya masing masing, silahkan cek chat pribadi untuk melihat role kalian. Berhati-hatilah para warga, mungkin malam ini adalah malah terakhir untukmu",
contextInfo: setting.fakereply ? {
mentionedJid: player,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb
}
} : {mentionedJid: player}
}, {ephemeralExpiration: m.expiration});
await run(m.chat, werewolf);
} else if (value === "vote") {
if (!werewolf[m.chat]) return m.reply("Belum ada sesi permainan");
if (werewolf[m.chat].status === false) return m.reply("Sesi permainan belum dimulai");
if (werewolf[m.chat].time !== "voting") return m.reply("Sesi voting belum dimulai");
if (playerOnRoom(m.sender, m.chat, werewolf) === false) return m.reply("Kamu bukan player");
if (dataPlayer(m.sender, werewolf).isdead === true) return m.reply("Kamu sudah mati");
if (!target || target.length < 1) return m.reply("Masukan nomor player");
if (isNaN(target)) return m.reply("Gunakan hanya nomor");
if (dataPlayer(m.sender, werewolf).isvote === true) return m.reply("Kamu sudah melakukan voting");
b = getPlayerById(m.chat, m.sender, parseInt(target), werewolf);
if (b.db.isdead === true) return m.reply(`Player ${target} sudah mati.`);
if (werewolf[m.chat].player.length < parseInt(target)) return m.reply("Invalid");
if (getPlayerById(m.chat, m.sender, parseInt(target), werewolf) === false) return m.reply("Player tidak terdaftar!");
vote(m.chat, parseInt(target), m.sender, werewolf);
return m.reply("✅ Vote");
} else if (value === "exit") {
if (!werewolf[m.chat]) return m.reply("Tidak ada sesi permainan");
if (playerOnRoom(m.sender, m.chat, werewolf) === false) return m.reply("Kamu tidak dalam sesi permainan");
if (werewolf[m.chat].status === true) return m.reply("Permainan sudah dimulai, kamu tidak bisa keluar");
playerExit(m.chat, m.sender, werewolf);
m.reply(`@${m.sender.split("@")[0]} Keluar dari permainan`);
} else if (value === "delete") {
if (!werewolf[m.chat]) return m.reply("Tidak ada sesi permainan");
if (werewolf[m.chat].owner !== m.sender) return m.reply(`Hanya @${werewolf[m.chat].owner.split('@')[0]} yang dapat menghapus sesi permainan ini`);
mecha.sendMessage(m.chat, {text: "Sesi permainan berhasil dihapus"}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => {
delete werewolf[m.chat];
});
} else if (value === "player") {
if (!werewolf[m.chat]) return m.reply("Tidak ada sesi permainan");
if (playerOnRoom(m.sender, m.chat, werewolf) === false) return m.reply("Kamu tidak dalam sesi permainan");
if (werewolf[m.chat].player.length === 0) return m.reply("Sesi permainan belum memiliki player");
let player = [];
let text = "*W E R E W O L F - G A M E*\n\nLIST PLAYER:\n";
for (let i = 0; i < werewolf[m.chat].player.length; i++) {
text += `(${werewolf[m.chat].player[i].number}) @${werewolf[m.chat].player[i].id.split('@')[0]} ${werewolf[m.chat].player[i].isdead === true ? '☠️ ' + werewolf[m.chat].player[i].role : ''}\n`;
player.push(werewolf[m.chat].player[i].id);
}
mecha.sendMessage(m.chat, {
text: text,
contextInfo: setting.fakereply ? {
mentionedJid: player,
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb
}
} : {mentionedJid: player}
}, {quoted: m, ephemeralExpiration: m.expiration});
} else {
let text = `\n*W E R E W O L F - G A M E*\n\nPermainan Sosial Yang Berlangsung Dalam Beberapa Putaran/ronde. Para Pemain Dituntut Untuk Mencari Seorang Penjahat Yang Ada Dipermainan. Para Pemain Diberi Waktu, Peran, Serta Kemampuannya Masing-masing Untuk Bermain Permainan Ini\n\n*⌂ C O M M A N D*\n`;
text += `${m.prefix + m.command} create\n`;
text += `${m.prefix + m.command} join\n`;
text += `${m.prefix + m.command} start\n`;
text += `${m.prefix + m.command} exit\n`;
text += `${m.prefix + m.command} delete\n`;
text += `${m.prefix + m.command} player\n`;
text += `\nPermainan ini dapat dimainkan oleh 5 sampai 12 orang.`;
mecha.sendMessage(m.chat, {
text: text.trim(),
contextInfo: setting.fakereply ? {
externalAdReply: {
title: 'WEREWOLF - GAME',
body: global.header,
mediaType: 1,
renderLargerThumbnail: false,
thumbnail: await resize(thumb, 300, 175),
sourceUrl: setting.link,
mediaUrl: thumb
}
} : {}
}, {quoted: m, ephemeralExpiration: m.expiration});
}
} else if (m.isPc) {
if (playerOnGame(m.sender, werewolf) === false) return m.reply("Kamu tidak dalam sesi game");
if (dataPlayer(m.sender, werewolf).status === true) return m.reply("Skill telah digunakan, skill hanya bisa digunakan sekali setiap malam");
if (dataPlayer(m.sender, werewolf).isdead === true) return m.reply("Kamu sudah mati");
if (!target || target.length < 1) return m.reply("Masukan nomor player");
if (isNaN(target)) return m.reply("Gunakan hanya nomor");
let byId = getPlayerById2(m.sender, parseInt(target), werewolf);
if (byId.db.isdead == true) return m.reply("Player sudah mati");
if (byId.db.id === m.sender) return m.reply("Tidak bisa menggunakan skill untuk diri sendiri");
if (byId === false) return m.reply("Player tidak terdaftar");
if (value === "kill") {
if (dataPlayer(m.sender, werewolf).role !== "werewolf") return m.reply("Peran ini bukan untuk kamu");
if (byId.db.role === "sorcerer") return m.reply("Tidak bisa menggunakan skill untuk teman");
if (getDeadPlayer(m.sender, parseInt(target), werewolf)) return m.reply("Player sudah di bunuh werewolf lain");
return mecha.reply(m.chat, `Berhasil membunuh player ${parseInt(target)}`, m)
.then(() => {
dataPlayer(m.sender, werewolf).status = true;
killWerewolf(m.sender, parseInt(target), werewolf);
});
} else if (value === "dreamy") {
if (dataPlayer(m.sender, werewolf).role !== "seer") return m.reply("Peran ini bukan untuk kamu");
let dreamy = dreamySeer(m.sender, parseInt(target), werewolf);
return m.reply(`Berhasil membuka identitas player ${target} adalah ${dreamy}`)
.then(() => {
dataPlayer(m.sender, werewolf).status = true;
});
} else if (value === "deff") {
if (dataPlayer(m.sender, werewolf).role !== "guardian") return m.reply("Peran ini bukan untuk kamu");
return m.reply(`Berhasil melindungi player ${target}`).then(() => {
protectGuardian(m.sender, parseInt(target), werewolf);
dataPlayer(m.sender, werewolf).status = true;
});
} else if (value === "sorcerer") {
if (dataPlayer(m.sender, werewolf).role !== "sorcerer") return m.reply("Peran ini bukan untuk kamu");
let sorker = sorcerer(m.sender, parseInt(target), werewolf);
return m.reply(`Berhasil membuka identitas player ${target} adalah ${sorker}`)
.then(() => {
dataPlayer(m.sender, werewolf).status = true;
});
}
}
} catch (e) {
delete data;
return mecha.reply(m.chat, `Terjadi kesalahan pada sesi game ini dan sesi game werewolf telah dihapus otomatis.\n\n${func.jsonFormat(e)}\n> silahkan mulai ulang game werewolf.`, m)
}
},
premium: false
}