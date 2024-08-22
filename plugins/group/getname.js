exports.run = {
usage: ['getname', 'getpp', 'getbio'],
use: 'mention or reply',
category: 'group',
async: async (m, { mecha, froms }) => {
switch (m.command) {
case 'getname':
if (m.quoted || m.text) {
if (froms in global.db.users) {
m.reply(`${global.db.users[froms].name}`)
} else {
m.reply(`${await mecha.getName(froms)}`)
}
} else m.reply('Mention or Reply chat target.')
break
case 'getpp':
if (m.quoted || m.text) {
if (froms === global.owner && !m.isOwner) return m.reply('Tidak bisa getpp creator saya!')
let pporang = await mecha.profilePictureUrl(froms, 'image').catch(_ => '')
if (pporang) {
mecha.sendMessage(m.chat, {image: {url: pporang}, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply('Gagal profile di private.')
} else m.reply('Mention or Reply chat target.')
break
case 'getbio':
if (m.quoted || m.text) {
let biou = (await mecha.fetchStatus(froms).catch(console.log('[ ERROR BIO ]')) || {}).status || 'Bio di private!'
m.reply(biou)
} else m.reply('Mention or Reply chat target.')
break
}
}
}