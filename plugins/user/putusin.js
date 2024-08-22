exports.run = {
usage: ['putusin'],
hidden: ['putus'],
category: 'user',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
if (user.pasangan.id == ''){
return m.reply(`Kamu tidak memiliki pasangan!`)
}
let ayang = global.db.users[global.db.users[m.sender].pasangan.id]
if (typeof ayang == 'undefined'){
m.reply(`Berhasil putus hubungan dengan @${global.db.users[m.sender].pasangan.id.split('@')[0]}`)
user.pasangan.id = ''
user.pasangan.time = 0
}
if (m.sender == ayang.pasangan.id){
m.reply(`Berhasil putus hubungan dengan @${global.db.users[m.sender].pasangan.id.split('@')[0]}`)
user.pasangan.id = ''
ayang.pasangan.id = ''
user.pasangan.time = 0
ayang.pasangan.time = 0
} else m.reply(`Kamu tidak memiliki pasangan!`)
},
group: true
}