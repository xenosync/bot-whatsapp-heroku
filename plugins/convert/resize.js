const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

exports.run = {
usage: ['resize'],
use: 'reply photo',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
let panjang = m.text.split('x')[0]
let lebar = m.text.split('x')[1]
if (!lebar) return m.reply(`Masukan ukuran panjang x lebar, contoh ${m.cmd} 200x200`)
mecha.sendReact(m.chat, '🕒', m.key)
let media = await mecha.downloadAndSaveMediaMessage(m)
let ran = path.join(process.cwd(), 'sampah', func.filename('jpeg'))
exec(`ffmpeg -i ${media} -vf scale=${panjang}:${lebar} ${ran}`, async (err) => {
fs.unlinkSync(media)
if (err) return m.reply(func.jsonFormat(err))
let buffer = fs.readFileSync(ran)
await mecha.sendMessage(m.chat, {mimetype: 'image/jpeg', image: buffer, caption: `Nih ${m.text}`}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => fs.unlinkSync(ran))
})
} else m.reply(`Reply gambar dengan caption panjang x lebar, contoh ${m.cmd} 200 x 200`)
},
limit: true
}