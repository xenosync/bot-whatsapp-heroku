exports.run = {
usage: ['kolam'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *R P G - K O L A M*

*🐋 = ${user.orca} orca*
*🐳 = ${user.paus} paus*
*🐬 = ${user.lumba} lumba*
*🦈 = ${user.hiu} hiu*
*🐟 = ${user.ikan} ikan*
*🐟 = ${user.lele} lele*
*🐡 = ${user.bawal} bawal*
*🐠 = ${user.nila} nila*
*🦀 = ${user.kepiting} kepiting*
*🦞 = ${user.lobster} lobster*
*🐙 = ${user.gurita} gurita*
*🦑 = ${user.cumi} cumi*
*🦐 = ${user.udang} udang*

Gunakan *${m.prefix}sell* untuk dijual atau *${m.prefix}cook* untuk dijadikan bahan masakan.`
await mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbUrl: 'https://telegra.ph/file/4a2dad6f0f6dfef650bf3.jpg', 
largeThumb: true, 
expiration: m.expiration
})
},
register: true
}