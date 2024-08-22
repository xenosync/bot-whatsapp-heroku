const fs = require ('fs');
const path = require('path');
const { exec } = require('child_process');

exports.run = {
usage: ['toimage'],
hidden: ['toimg'],
use: 'reply sticker',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (/webp/.test(quoted.mime)) {
if (m.quoted.isAnimated) return m.reply(`Untuk stikergif gunakan perintah ${m.prefix}tovideo`)
mecha.sendReact(m.chat, '🕒', m.key)
let media = await mecha.downloadAndSaveMediaMessage(m)
let png = path.join(process.cwd(), 'sampah', func.filename('png'))
exec(`ffmpeg -i ${media} ${png}`, (err) => {
fs.unlinkSync(media)
if (err) return m.reply('Conversion failed.')
mecha.sendMessage(m.chat, {image: fs.readFileSync(png), caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
})
} else m.reply(`Reply sticker dengan caption *${m.cmd}*`)
},
limit: true
}