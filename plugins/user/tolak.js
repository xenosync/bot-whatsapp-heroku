exports.run = {
usage: ['tolak'],
use: 'mention or reply',
category: 'user',
async: async (m, { mecha, bot, froms }) => {
if (m.quoted || m.text) {
if (global.db.users[froms] == undefined) return m.reply('User data not found.')
if (froms === m.sender) return m.reply(`Tidak bisa berpacaran dengan diri sendiri!`)
if (froms === bot) return m.reply(`Tidak bisa berpacaran dengan bot!`)
if (global.db.users[froms].pasangan.id != m.sender){
m.reply(`Maaf @${froms.split('@')[0]} tidak sedang menembak anda`)
} else {
global.db.users[froms].pasangan.id = ''
m.reply(`Kamu telah menolak cinta dari @${froms.split('@')[0]}\nKasian awowkwkwk :v`)
}
} else m.reply('Mention or Reply chat target.')
},
group: true
}