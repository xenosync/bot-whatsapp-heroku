exports.run = {
usage: ['ikhlasin'],
category: 'user',
async: async (m, { mecha }) => {
if (!global.db.users[m.sender].pasangan.id) return m.reply(`Kamu tidak sedang menembak siapapun!`)
m.reply(`Kamu sudah mengikhlaskan @${global.db.users[m.sender].pasangan.id.split('@')[0]} karena dia tidak memberikan jawaban diterima atau ditolak.`)
global.db.users[m.sender].pasangan.id = ''
},
group: true
}