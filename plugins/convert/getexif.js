const { format } = require('util')
const webpmux = require('node-webpmux')

exports.run = {
usage: ['getexif'],
use: 'reply sticker',
category: 'convert',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply('Reply stikernya!')
if (/sticker/.test(m.quoted.mtype)) {
let img = new webpmux.Image();
await img.load(await m.quoted.download())
let data = JSON.parse(img.exif.slice(22))
let txt = `◦  Sticker-pack-id : ${data['sticker-pack-id'] ?? '-'}`
txt += `\n◦  Sticker-pack-name : ${data['sticker-pack-name'] ?? '-'}`
txt += `\n◦  Sticker-pack-publisher : ${data['sticker-pack-publisher'] ?? '-'}`
txt += `\n◦  Is-avatar-sticker : ${data['is-avatar-sticker'] != 0 ? 'Yes' : 'No'}`
m.reply(txt)
}
},
limit: true
}