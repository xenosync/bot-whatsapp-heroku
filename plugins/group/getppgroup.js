exports.run = {
usage: ['getppgroup'],
hidden: ['getppgrup', 'getppgc'],
category: 'group',
async: async (m, { func, mecha }) => {
let pic = await func.fetchBuffer(await mecha.profilePictureUrl(m.chat, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png'))
mecha.sendMessage(m.chat, {image: pic, caption: m.groupName}, {quoted: m, ephemeralExpiration: m.expiration})
},
group: true,
admin: true
}