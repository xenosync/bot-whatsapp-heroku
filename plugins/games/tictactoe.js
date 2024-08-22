exports.run = {
usage: ['tictactoe'],
hidden: ['ttt'],
use: 'mention or reply',
category: 'games',
async: async (m, { func, mecha, froms }) => {
if (!m.isGc) return m.reply(global.mess.group)
if (Object.values(global.db.tictactoe).find(v => v.id.startsWith('tictactoe') && [v.penantang, v.ditantang].includes(m.sender))) return m.reply(`Selesaikan tictactoe mu yang sebelumnya!`)
if (m.quoted || m.text) {
if (!froms) return m.reply('Invalid number.')
if (froms === m.bot) return m.reply(`Tidak bisa bermain dengan bot!`)
if (froms === m.sender) return m.reply(`Sad amat main ama diri sendiri`)
if (func.ceklimit(m.sender, 1)) return m.reply(global.mess.limit)
let hadiah = func.randomNomor(3000, 5000)
let id = 'tictactoe_' + Date.now()
mecha.reply(m.chat, `@${m.sender.split('@')[0]} menantang @${froms.split('@')[0]} untuk bermain TicTacToe\n\n*Kirim (Y/N)* untuk bermain\n\nHadiah : ${hadiah} balance`, m)
global.db.tictactoe[id] = {
id: id,
status: 'WAIT',
hadiah: hadiah,
asal: m.chat,
penantang: m.sender,
ditantang: froms,
TicTacToe: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
}
} else m.reply('Mention or Reply chat target.')
},
main: async (m, { func, mecha, fkon, errorMessage }) => {
/* FUNCTION TICTACTOE BY SURYA */
const isTicTacToe = (from, _dir) => {
let status = false
Object.keys(_dir).forEach((i) => {
if (_dir[i].id === from) {
status = true
}
})
return status
}

const getPosTic = (from, _dir) => {
let position = null
Object.keys(_dir).forEach((i) => {
if (_dir[i].id === from) {
position = i
}
})
if (position !== null) {
return position
}
}

const KeisiSemua = (tic) => {
let status = true
for (let i of tic){
if (i !== '❌' && i !== '⭕'){
status = false
}
}
return status
}

const cekIsi = (nomor, tic) => {
let status = false
if (tic[nomor] === '❌' || tic[nomor] === '⭕'){
status = true
}
return status
}

const cekTicTac = (tic) => {
let status = false
if (tic[0] === '❌' && tic[1] === '❌' && tic[2] === '❌' || tic[0] === '⭕' && tic[1]=== '⭕' && tic[2] === '⭕'){
status = true
} else if (tic[3] === '❌' && tic[4] === '❌' && tic[5] === '❌' || tic[3] === '⭕' && tic[4] === '⭕' && tic[5] === '⭕'){
status = true
} else if (tic[6] === '❌' && tic[7] === '❌' && tic[8] === '❌' || tic[6] === '⭕' && tic[7] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[0] === '❌' && tic[3] === '❌' && tic[6] === '❌' || tic[0] === '⭕' && tic[3] === '⭕' && tic[6] === '⭕'){
status = true
} else if (tic[1] === '❌' && tic[4] === '❌' && tic[7] === '❌' || tic[1] === '⭕' && tic[4] === '⭕' && tic[7] === '⭕'){
status = true
} else if (tic[2] === '❌' && tic[5] === '❌' && tic[8] === '❌' || tic[2] === '⭕' && tic[5] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[0] === '❌' && tic[4] === '❌' && tic[8] === '❌' || tic[0] === '⭕' && tic[4] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[2] === '❌' && tic[4] === '❌' && tic[6] === '❌' || tic[2] === '⭕' && tic[4] === '⭕' && tic[6] === '⭕'){
status = true
}
return status 
}

/* TICTACTOE BY SURYA */
try {
let room = Object.values(global.db.tictactoe).find(v => v.id.startsWith('tictactoe') && [v.penantang, v.ditantang].includes(m.sender))
if (room) {
let nomor = [1, 2, 3, 4, 5, 6, 7, 8, 9]
//let posi = global.db.tictactoe[m.chat]
let anu = room.TicTacToe
if (m.sender === room.ditantang && m.isGc && room.status === 'WAIT') {
if (m.budy.toLowerCase() === 'y'){
await mecha.reply(m.chat, `Tictactoe telah dikirimkan ke chat\n\n@${room.penantang.split('@')[0]} dan @${room.ditantang.split('@')[0]}\n\nSilahkan selesaikan tictactoe di chat masing²\nklik wa.me/${m.bot.split('@')[0]}`, fkon)
mecha.reply(room.penantang, `Giliran kamu mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}`)
mecha.reply(room.ditantang, `Menunggu lawan mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}
    
_Giliran Lawan_`)
room.status = true;
} else if (m.budy.toLowerCase() === 'n'){
m.reply(`@${room.ditantang.split('@')[0]} menolak, game dibatalkan`, [room.ditantang], false)
delete global.db.tictactoe[room.id];
return !0
}
}
if (m.isPc && room.status == true){
if (m.chat === room.penantang){
for (let i of nomor){
if (Number(m.budy) === i){
if (cekIsi(Number(m.budy) - 1, anu)) return mecha.reply(room.penantang, `Nomor tersebut sudah terisi`, m)
room.TicTacToe[Number(m.budy) - 1] = '❌'
if (cekTicTac(room.TicTacToe)){
let caption = `Game tictactoe sudah selesai

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}`
mecha.reply(room.penantang, caption, fkon)
mecha.reply(room.ditantang, caption, fkon)
mecha.reply(room.asal, `@${room.penantang.split('@')[0]} Menang

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Hadiah : ${room.hadiah} balance
Ingin bermain lagi? ${m.prefix}tictactoe`, fkon)
global.db.users[room.penantang].balance += room.hadiah
global.db.users[room.ditantang].balance -= room.hadiah
global.db.users[room.penantang].game.tictactoe += 1
delete global.db.tictactoe[room.id];
} else if (KeisiSemua(anu)) {
let caption = `Game tictactoe sudah selesai

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}`
mecha.reply(room.penantang, caption, fkon)
mecha.reply(room.ditantang, caption, fkon)
mecha.reply(room.asal, `乂  *H A S I L - S E R I*

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${m.prefix}tictactoe`, fkon)
delete global.db.tictactoe[room.id];
} else {
mecha.reply(room.penantang, `Kamu sudah mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

_Giliran Lawan_`, fkon)
mecha.reply(room.ditantang, `Lawan sudah mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

_Giliran Kamu_`, fkon)
room.status = false
}
}
}
}
} else if (m.isPc && room.status == false){
if (m.chat === room.ditantang){
for (let i of nomor){
if (Number(m.budy) === i){
if (cekIsi(Number(m.budy) - 1, anu)) return mecha.reply(room.ditantang, `Nomor tersebut sudah terisi`, m)
room.TicTacToe[Number(m.budy) - 1] = '⭕' 
if (cekTicTac(anu)){
let caption = `Game tictactoe sudah selesai

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}`
mecha.reply(room.penantang, caption, fkon)
mecha.reply(room.ditantang, caption, fkon)
mecha.reply(room.asal, `@${room.ditantang.split('@')[0]} Menang

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Hadiah : ${room.hadiah} balance
Ingin bermain lagi? ${m.prefix}tictactoe`, fkon)
global.db.users[room.ditantang].balance += room.hadiah
global.db.users[room.penantang].balance -= room.hadiah
global.db.users[room.ditantang].game.tictactoe += 1
delete global.db.tictactoe[room.id];
} else if (KeisiSemua(anu)) {
let caption = `Game tictactoe sudah selesai

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}`
mecha.reply(room.penantang, caption, fkon)
mecha.reply(room.ditantang, caption, fkon)
mecha.reply(room.asal, `乂  *H A S I L - S E R I*

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${m.prefix}tictactoe`, fkon)
delete global.db.tictactoe[room.id];
} else {
mecha.reply(room.ditantang, `Kamu sudah mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

_Giliran Lawan_`, fkon)
mecha.reply(room.penantang, `Lawan sudah mengisi

@${room.penantang.split('@')[0]} = ❌
@${room.ditantang.split('@')[0]} = ⭕

    ${anu[0]}${anu[1]}${anu[2]}
    ${anu[3]}${anu[4]}${anu[5]}
    ${anu[6]}${anu[7]}${anu[8]}

_Giliran Kamu_`, fkon)
room.status = true
}
}
}
}
}
}
} catch (e){
return errorMessage(e)
}
}
}