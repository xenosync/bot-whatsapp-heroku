exports.run = {
usage: ['kandang'],
category: 'rpg',
async: async (m, { func, mecha }) => {
let user = global.db.users[m.sender]
let txt = `乂  *R P G - K A N D A N G*

*🐂 : ${user.banteng} banteng*
*🐅 : ${user.harimau} harimau*
*🐘 : ${user.gajah} gajah*
*🐐 : ${user.kambing} kambing*
*🐼 : ${user.panda} panda*
*🐊 : ${user.buaya} buaya*
*🐃 : ${user.kerbau} kerbau*
*🐮 : ${user.sapi} sapi*
*🐒 : ${user.monyet} monyet*
*🐗 : ${user.babihutan} babihutan*
*🐖 : ${user.babi} babi*
*🐓 : ${user.ayam} ayam*

Gunakan *${m.prefix}sell* untuk dijual atau *${m.prefix}cook* untuk dijadikan bahan masakan.`
await mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer, 
thumbUrl: 'https://telegra.ph/file/295a6d5105771875e1797.jpg', 
largeThumb: true, 
expiration: m.expiration
})
},
register: true
}