const fs = require('fs');

exports.run = {
usage: ['whatmusic'],
use: 'reply audio/video',
category: 'searching',
async: async (m, { func, mecha, quoted }) => {
const acrcloud = require('acrcloud');
let apikey = [
{
access_key: "c9f2fca5e16a7986b0a6c8ff70ed0a06",
access_secret: "PQR9E04ZD60wQPgTSRRqwkBFIWEZldj0G3q7NJuR"
},
{
access_key: 'c33c767d683f78bd17d4bd4991955d81',
access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
}
]
let data = func.pickRandom(apikey);
let acr = new acrcloud({
host: 'identify-eu-west-1.acrcloud.com',
access_key: data.access_key,
access_secret: data.access_secret
})

if (/audio|video/.test(quoted.mime)) {
m.reply(global.mess.wait)
let media = await quoted.download()
let ext = quoted.mime.split('/')[1]
fs.writeFileSync(`./sampah/${m.sender}.${ext}`, media)
let res = await acr.identify(fs.readFileSync(`./sampah/${m.sender}.${ext}`))
let { code, msg } = res.status
if (code !== 0) return m.reply('Music tidak di temukan.')
let { title, artists, album, genres, release_date } = res.metadata.music[0]
let txt = `乂  *HASIL PENCARIAN LAGU*\n`
txt += `\n◦ Title: ${title}`
txt += `\n◦ Nama penyanyi: ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'No encontrado'}`
txt += `\n◦ Album: ${album.name || 'No encontrado'}`
txt += `\n◦ Genre: ${genres !== undefined ? genres.map(v => v.name).join(', ') : 'No encontrado'}`
txt += `\n◦ Di Rilis: ${release_date || 'No encontrado'}`
fs.unlinkSync(`./sampah/${m.sender}.${ext}`)
mecha.reply(m.chat, txt.trim(), m);
} else m.reply(`Reply audio atau video dengan perintah ${m.cmd}`)
},
limit: 3
}