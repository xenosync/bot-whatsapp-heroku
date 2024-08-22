exports.run = {
usage: ['add'],
use: 'enter number or reply',
category: 'group',
async: async (m, { mecha, froms }) => {
try {
if (m.quoted || m.text) {
if (froms.startsWith('08')) return m.reply('Awali nomor dengan +62')
let users = m.mentionedJid.length !== 0 ? m.mentionedJid.slice(0, 2) : m.quoted ? [m.quoted.sender] : (await Promise.all(m.text.split(',').map(v => v.replace(/[^0-9]/g, '')).filter(v => v.length > 4 && v.length < 20).map(async (v) => [v, await mecha.onWhatsApp(v + '@s.whatsapp.net')]))).filter(v => v[1][0]?.exists).map(v => v[0] + '@s.whatsapp.net').slice(0, 2)
await mecha.groupParticipantsUpdate(m.chat, users, 'add').then(async (res) => {
for (let i of res) {
if (i.status == 403){
mecha.sendMessage(m.chat, {text: `Diprivasi. mengirimkan groupInvite kepada @${i.jid.split('@')[0]}`, mentions: [i.jid]}, {quoted: m, ephemeralExpiration: m.expiration})
mecha.sendGroupInvite(m.chat, i.jid, {
inviteCode: i.content.content[0].attrs.code,
inviteExpiration: i.content.content[0].attrs.expiration,
groupName: m.groupName,
jpegThumbnail: await mecha.profilePictureUrl(m.chat, 'image').catch(_ => 'https://telegra.ph/file/0d25a520bfa0909c74466.jpg'),
caption: 'Undangan untuk bergabung ke grup WhatsApp saya',
quoted: null
})
} else if (i.status == 409){
m.reply(`@${i.jid.split('@')[0]} already in this group`)
} else if (i.status == 408){
m.reply(`@${i.jid.split('@')[0]} has left the group recently`)
} else if (i.status == 401){
m.reply(`Bot blocked by @${i.jid.split('@')[0]}`)
} else m.reply(`Successfully added member`)
}
})
} else m.reply('Enter number or Reply chat target.')
} catch (e) {
return m.reply('Maaf terjadi kesalahan.');
}
},
group: true,
admin: true,
botAdmin: true
}