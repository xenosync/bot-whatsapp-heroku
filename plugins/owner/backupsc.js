const fs = require('fs');

exports.run = {
usage: ['backupsc'],
hidden: ['backupme'],
category: 'owner',
async: async (m, { func, mecha }) => {
if (![...global.developer].includes(m.sender)) return
mecha.sendReact(m.chat, '🕒', m.key)
try {
let data = await func.backupSC();
let caption = `Berikut adalah file backup kode bot:\nNama file: ${data.name}\nUkuran file: ${data.size} MB`
await mecha.sendMessage('6285651915144@s.whatsapp.net', {
document: {
url: data.name
},
caption: caption,
mimetype: 'application/zip', 
fileName: data.name
}, {quoted: m, ephemeralExpiration: m.expiration})
.then(_ => fs.unlinkSync(data.name));
} catch (error) {
console.error(error)
m.reply('Terjadi kesalahan saat membuat backup :\n\n' + String(error));
}
},
devs: false
}