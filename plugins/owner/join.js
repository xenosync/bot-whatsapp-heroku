exports.run = {
usage: ['join'],
use: 'link grup',
category: 'owner',
async: async (m, { func, mecha }) => {
if (m.quoted || m.text) {
try {
let url = m.quoted ? m.quoted.text : m.text
if (url.includes('chat.whatsapp.com')) {
await mecha.groupAcceptInvite(url.split('https://chat.whatsapp.com/')[1])
.then(res => mecha.reply(m.chat, String(res), m))
} else m.reply('Masukkan link grup dengan benar!')
} catch (e) {
return m.reply('Bot sudah terkick, tidak dapat join.')
}
} else m.reply(`Kirim perintah ${m.cmd} link grup`)
},
owner: true
}