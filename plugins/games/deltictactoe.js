exports.run = {
usage: ['deltictactoe'],
hidden: ['delttt'],
category: 'games',
async: async (m, { func, mecha }) => {
let room = Object.values(global.db.tictactoe).find(v => v.id.startsWith('tictactoe') && [v.penantang, v.ditantang].includes(m.sender))
if (room) {
if (m.isAdmin || m.isOwner) {
delete global.db.tictactoe[room.id];
m.reply(`Berhasil menghapus sesi tictactoe di grup ini`)
} else if (room.penantang.includes(m.sender)) {
delete global.db.tictactoe[room.id];
m.reply(`Berhasil menghapus sesi tictactoe di grup ini`)
} else if (room.ditantang.includes(m.sender)) {
delete global.db.tictactoe[m.chat];
m.reply(`Berhasil menghapus sesi tictactoe di grup ini`)
} else {
m.reply(`Anda tidak bisa menghapus sesi tictactoe karena bukan pemain!`)
}
} else m.reply('Tidak ada sesi yang berlangsung.')
},
group: true
}