exports.run = {
usage: ['terima'],
use: 'mention or reply',
category: 'user',
async: async (m, { mecha, froms, bot }) => {
if (m.quoted || m.text) {
if (global.db.users[froms] == undefined) return m.reply('User data not found.')
if (froms === m.sender) return m.reply(`Tidak bisa berpacaran dengan diri sendiri!`)
if (froms === bot) return m.reply(`Tidak bisa berpacaran dengan bot!`)
if (global.db.users[froms].pasangan.id != m.sender){
m.reply(`Maaf @${froms.split('@')[0]} tidak sedang menembak anda.`)
} else {
global.db.users[m.sender].pasangan.id = froms
global.db.users[m.sender].pasangan.time = + Date.now()
global.db.users[froms].pasangan.time = + Date.now()
m.reply(`Selamat! kamu resmi berpacaran dengan @${froms.split('@')[0]}\n\nSemoga bisa ke jenjang yang lebih serius @${froms.split('@')[0]} ❤️ @${m.sender.split('@')[0]} 🥳🥳`)
}
} else m.reply('Mention or Reply chat target.')
},
group: true
}