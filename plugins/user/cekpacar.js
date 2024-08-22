exports.run = {
usage: ['cekpacar'],
use: 'mention or reply',
category: 'user',
async: async (m, { func, mecha, froms }) => {
if (m.quoted || m.text) {
let orang = 'Orang yang kamu tag'
if (global.db.users[froms] == undefined) return m.reply('User data not found.')
if (typeof global.db.users[global.db.users[froms].pasangan.id] == 'undefined' && global.db.users[froms].pasangan.id != ''){
return m.reply(`User data not found.`)
}
if (global.db.users[froms].pasangan.id == '') {
m.reply(`${orang} tidak memiliki pasangan dan tidak sedang menembak siapapun\n\n*Kirim ${m.prefix}tembak @tag untuk menembak seseorang*`)
} else if (global.db.users[global.db.users[froms].pasangan.id].pasangan.id != froms){
m.reply(`${orang} sedang digantung oleh @${global.db.users[froms].pasangan.id.split('@')[0]} karena tidak sedang di terima atau di tolak\n\n*Kirim ${m.prefix}ikhlaskan untuk menghapus nama dia dari hatimu*`)
} else {
let timejadian = func.toTime(Date.now() - global.db.users[froms].pasangan.time)
m.reply(`${orang} sedang menjalani hubungan dengan @${global.db.users[froms].pasangan.id.split('@')[0]} 🥳🥳\nSelama ${timejadian}`)
}
} else {
if (global.db.users[m.sender] == undefined) return m.reply('User data not found.')
if (typeof global.db.users[global.db.users[m.sender].pasangan.id] == 'undefined' && global.db.users[m.sender].pasangan.id != ''){
return m.reply(`User data not found.`)
}
if (global.db.users[m.sender].pasangan.id == '') {
m.reply(`Kamu tidak memiliki pasangan dan tidak sedang menembak siapapun\n\n*Kirim ${m.prefix}tembak @tag untuk menembak seseorang*`)
} else if (global.db.users[global.db.users[m.sender].pasangan.id].pasangan.id != m.sender){
m.reply(`Kamu sedang digantung oleh @${global.db.users[m.sender].pasangan.id.split('@')[0]} karena tidak sedang di terima atau di tolak\n\n*Kirim ${m.prefix}ikhlaskan untuk menghapus nama dia dari hatimu*`)
} else {
let timejadian = func.toTime(Date.now() - global.db.users[m.sender].pasangan.time)
m.reply(`Kamu sedang menjalani hubungan dengan @${global.db.users[m.sender].pasangan.id.split('@')[0]} 🥳🥳\nSelama ${timejadian}`)
}
}
},
group: true
}