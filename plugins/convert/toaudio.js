const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

exports.run = {
usage: ['toaudio'],
hidden: ['tomp3'],
use: 'reply video',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (/video/.test(quoted.mime)){
m.reply(global.mess.wait)
let media = await mecha.downloadAndSaveMediaMessage(m)
let ran = path.join(process.cwd(), 'sampah', func.filename('mp3'))
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
if (err) return m.reply(global.mess.error.api)
mecha.sendMessage(m.chat, {audio: fs.readFileSync(ran), mimetype: 'audio/mpeg'}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => {
fs.unlinkSync(media)
fs.unlinkSync(ran)
})
})
} else m.reply(`Kirim/Reply video dengan caption ${m.cmd}`)
},
limit: true
}