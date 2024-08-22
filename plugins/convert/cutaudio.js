let fs = require('fs');
let path = require('path');
let { exec } = require('child_process');

exports.run = {
usage: ['cutaudio'],
hidden: ['cutmp3'],
use: 'text',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (!/audio/.test(quoted.mime)) return m.reply(`Reply vn/audio yang ingin diubah dengan caption *${m.cmd}*`)
if (!(m.args[0] && m.args[1])) return m.reply(func.example(m.cmd, '00:00:30 00:00:60'))
let media = await mecha.downloadAndSaveMediaMessage(m)
if (!media) return m.reply('Can\'t download audio!')
m.reply(global.mess.wait)
let filename = path.join(process.cwd(), 'sampah', func.filename('mp3'))
exec(`ffmpeg -ss ${m.args[0]} -i ${media} -t ${m.args[1]} -c copy ${filename}`, async (err) => {
if (err) return m.reply('Conversion failed.')
mecha.sendMessage(m.chat, {audio: fs.readFileSync(filename), mimetype: 'audio/mpeg'}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => {
fs.unlinkSync(media)
fs.unlinkSync(filename)
})
})
},
limit: 3
}