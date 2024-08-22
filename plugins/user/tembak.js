exports.run = {
usage: ['tembak'],
use: 'mention or reply',
category: 'user',
async: async (m, { mecha, froms, bot }) => {
if (m.quoted || m.text) {
if (global.db.users[froms] == undefined) return m.reply('User data not found.')
let beb = global.db.users[m.sender].pasangan.id
if (froms === m.sender) return m.reply(`Tidak bisa berpacaran dengan diri sendiri!`)
if (froms === bot) return m.reply(`Tidak bisa berpacaran dengan bot!`)
if (global.db.users[m.sender].gender == '') return m.reply(`Kamu belum memilih gender!\nKirim perintah ${m.prefix}gender L\n\nketik L untuk Laki-laki\nketik P untuk Perempuan`)
if (global.db.users[froms].gender == '') return m.reply(`@${froms.split('@')[0]} belum memilih gender!\nKirim perintah ${m.prefix}gender L\n\nketik L untuk Laki-laki\nketik P untuk Perempuan`)
if (global.db.users[m.sender].gender == 'Perempuan' && global.db.users[froms].gender == 'Perempuan') {
return m.reply(`Tidak bisa tembak @${froms.split('@')[0]} karena kalian *LESBI*`)
} else if (global.db.users[m.sender].gender == 'Laki-laki' && global.db.users[froms].gender == 'Laki-laki') {
return m.reply(`Tidak bisa tembak @${froms.split('@')[0]} karena kalian *GAY*`)
} else {
if (global.db.users[m.sender].pasangan.id != '' && global.db.users[global.db.users[m.sender].pasangan.id].pasangan.id == m.sender && global.db.users[m.sender].pasangan.id != froms) {
if (global.db.users[m.sender].pasangan.id == froms) return m.reply('Kamu sudah berpacaran dengan dia!')
m.reply(`Kamu sudah berpasangan dengan @${global.db.users[m.sender].pasangan.id.split('@')[0]}\n\nPutusin dulu! kirim ${m.prefix}putus @${global.db.users[m.sender].pasangan.id.split('@')[0]} untuk menembak @${froms.split('@')[0]}\n\nSetia dong!`)
} else if (global.db.users[froms].pasangan.id != '') {
let pacar = global.db.users[froms].pasangan.id
if (global.db.users[pacar].pasangan.id == froms) {
if (m.sender == pacar && global.db.users[m.sender].pasangan.id == froms) return m.reply(`Kamu sudah berpasangan dengan @${beb.split('@')[0]}\n\nSetia dong!`)
m.reply(`Tau sopan santun dikit teman?\n@${froms.split('@')[0]} sudah berpasangan dengan @${pacar.split('@')[0]}\n\nSilahkan cari pasangan yang lain!`)
} else {
global.db.users[m.sender].pasangan.id = froms
m.reply(`Kamu sudah mengajak @${froms.split('@')[0]} berpacaran!\nkamu hanya perlu menunggu jawaban dari dia...\n\n@${froms.split('@')[0]} silahkan ketik\n${m.prefix}terima @${m.sender.split('@')[0]} atau\n${m.prefix}tolak @${m.sender.split('@')[0]}`)
}
} else if (global.db.users[froms].pasangan.id == m.sender) {
global.db.users[m.sender].pasangan.id = froms
global.db.users[m.sender].pasangan.time = + Date.now()
global.db.users[froms].pasangan.time = + Date.now()
m.reply(`Selamat! kamu resmi berpacaran dengan @${froms.split('@')[0]}\n\nSemoga kalian bisa ke jenjang yang lebih serius 🥳🥳`)
} else {
global.db.users[m.sender].pasangan.id = froms
m.reply(`Kamu baru saja mengajak @${froms.split('@')[0]} berpacaran\n\n@${froms.split('@')[0]} Silahkan ketik\n${m.prefix}terima @${m.sender.split('@')[0]} atau\n${m.prefix}tolak @${m.sender.split('@')[0]}`)
}
}
} else m.reply('Mention or Reply chat target.')
},
group: true
}