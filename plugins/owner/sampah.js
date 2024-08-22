const fs = require('fs')
const path = require('path')

exports.run = {
usage: ['sampah', 'delsampah'],
category: 'owner',
async: async (m, { func, mecha }) => {
switch (m.command) {
case 'sampah':
let data = fs.readdirSync('./sampah').filter(v => ['gif', 'png', 'mp3', 'm4a', 'opus', 'mp4', 'jpg', 'jpeg', 'webp', 'webm', 'bin'].some(x => v.endsWith(x)))
if (data.length == 0) return m.reply('Empty trash.')
let txt = `乂  JUMLAH SAMPAH SYSTEM\n\n`
txt += `Total : ${data.length} Sampah\n\n`
txt += data.map(v => v).join('\n');
mecha.reply(m.chat, txt, m)
break
case 'delsampah':
let directoryPath = path.join('./sampah')
fs.readdir(directoryPath, async function (err, files) {
if (err) {
return m.reply('Unable to scan directory: ' + err);
} 
let filteredArray = await files.filter(v => ['gif', 'png', 'mp3', 'm4a', 'opus', 'mp4', 'jpg', 'jpeg', 'webp', 'webm', 'bin'].some(x => v.endsWith(x)))
let txt = `Detected ${filteredArray.length} junk file\n`
if (filteredArray.length == 0) return m.reply(txt)
filteredArray.map(function(a, b){
txt += `\n${b + 1}. ${a}`
})
let msg = await mecha.reply(m.chat, txt, m)
await func.delay(2000)
mecha.reply(m.chat, 'Delete junk files...', msg)
await filteredArray.forEach(function (file) {
fs.unlinkSync(`./sampah/${file}`)
});
await func.delay(2000)
mecha.reply(m.chat, 'Successfully removed all trash')
})
break
}
},
owner: true
}