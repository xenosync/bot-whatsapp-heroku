const { join } = require('path')
const { promises } = require('fs')
const { spawn } = require('child_process')

exports.run = {
usage: ['hdvideo'],
hidden: ['hdvid'],
use: 'reply video',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
mecha.hdvid = mecha.hdvid ? mecha.hdvid : {};
if (m.sender in mecha.hdvid) return m.reply('Masih ada proses yang sedang dijalankan, silahkan tunggu.');
if (!/video/.test(quoted.mime)) return m.reply(`Kirim/Reply video dengan caption *${m.cmd}*`)
else mecha.hdvid[m.sender] = true;
m.reply('Tunggu sebentar, proses ini memakan waktu cukup lama...')
try {
let tinggi = quoted.height;
let lebar = quoted.width;
const videoBuffer = await quoted.download();
const additionalArgs = [
'-c:v', 'libx264',
'-crf', m.args[2] || '10',
'-b:v', m.args[1] || '8M',
'-s', lebar * 2 + 'x' + tinggi * 2,
'-x264opts', 'keyint=30:min-keyint=30',
'-q:v', '60',
];
const buff = await videoConvert(videoBuffer, additionalArgs);
await mecha.sendMedia(m.chat, buff, m, {caption: global.mess.ok, expiration: m.expiration})
delete mecha.hdvid[m.sender];
} catch (err) {
m.reply('Maaf terjadi kesalahan.');
delete mecha.hdvid[m.sender];
}
},
premium: true
}

async function videoConvert(buffer, input = []) {
return new Promise(async (resolve, reject) => {
try {
const tmp = join(__dirname, '../../sampah', `${+new Date()}.mp4`);
await promises.writeFile(tmp, buffer);
const out = tmp.replace('.mp4', '_converted.mp4');
const args = [
'-y',
'-i', tmp,
...input,
out
];

spawn('ffmpeg', args)
.on('error', reject)
.on('close', async (code) => {
try {
await promises.unlink(tmp);
if (code !== 0) return reject(code);
const outputVideoBuffer = await promises.readFile(out);
await promises.unlink(out);
resolve(outputVideoBuffer);
} catch (e) {
reject(e);
}
});
} catch (e) {
reject(e);
}
});
}