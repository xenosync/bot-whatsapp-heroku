exports.run = {
usage: ['setppbot'],
hidden: ['setpp'],
use: 'reply photo',
category: 'owner',
async: async (m, { func, mecha, quoted }) => {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
if (func.somematch(['full', 'panjang'], m.args[0])) {
let media = await mecha.downloadAndSaveMediaMessage(m)
await mecha.createprofile(m.bot, media)
mecha.sendReact(m.chat, '✅', m.key)
} else {
let media = await quoted.download()
let data = await mecha.updateProfilePicture(m.bot, media)
mecha.sendReact(m.chat, '✅', m.key)
}
} else m.reply(`Kirim/Reply gambar dengan caption ${m.cmd} untuk mengubah foto profil bot.`)
},
owner: true
}