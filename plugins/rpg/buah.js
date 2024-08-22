exports.run = {
usage: ['listbuah'],
hidden: ['buah'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *L I S T - B U A H*

🍌 ${user.pisang} Pisang
🍇 ${user.anggur} Anggur
🥭 ${user.mangga} Mangga
🍊 ${user.jeruk} Jeruk
🍎 ${user.apel} Apel

Gunakan command *${m.prefix}sell* untuk menjual.`
mecha.reply(m.chat, txt, m)
},
register: true
}