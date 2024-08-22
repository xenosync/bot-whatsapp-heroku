const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

exports.run = {
usage: ['bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai'],
use: 'reply audio',
category: 'audio changer',
async: async (m, { func, mecha, quoted }) => {
let set
if (/bass/.test(m.command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
if (/blown/.test(m.command)) set = '-af acrusher=.1:1:64:0:log'
if (/deep/.test(m.command)) set = '-af atempo=4/4,asetrate=44500*2/3'
if (/earrape/.test(m.command)) set = '-af volume=12'
if (/fast/.test(m.command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
if (/fat/.test(m.command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
if (/nightcore/.test(m.command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
if (/reverse/.test(m.command)) set = '-filter_complex "areverse"'
if (/robot/.test(m.command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
if (/slow/.test(m.command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
if (/smooth/.test(m.command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
if (/tupai/.test(m.command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
if (/audio/.test(quoted.mime)) {
m.reply(global.mess.wait)
let media = await mecha.downloadAndSaveMediaMessage(m)
let ran = path.join(process.cwd(), 'sampah', func.filename('mp3'))
exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
fs.unlinkSync(media)
if (err) return m.reply(func.jsonFormat(err))
let buffer = fs.readFileSync(ran)
mecha.sendMessage(m.chat, {
audio: buffer, 
mimetype: 'audio/mpeg',
ptt: m.quoted.ptt ? true : false
}, {quoted: m, ephemeralExpiration: m.expiration}).then(() => fs.unlinkSync(ran))
})
} else m.reply(`Balas audio yang ingin diubah dengan caption ${m.cmd}`)
},
limit: true
}