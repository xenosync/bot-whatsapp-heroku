exports.run = {
usage: ['setppgroup'],
hidden: ['setppgrup', 'setppgc'],
use: 'reply photo / full',
category: 'admin tools',
async: async (m, { func, mecha, quoted }) => {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
if (m.args[0] === 'full') {
let media = await mecha.downloadAndSaveMediaMessage(m)
mecha.createprofile(m.chat, media)
m.reply(global.mess.ok)
} else {
let media = await quoted.download()
await mecha.updateProfilePicture(m.chat, media)
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
}
} else m.reply(`Kirim/reply gambar dengan caption ${m.cmd}`)
},
group: true,
admin: true,
boAdmin: true
}