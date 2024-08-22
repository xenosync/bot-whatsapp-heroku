exports.run = {
usage: ['tiktokslide2'],
hidden: ['ttslide2'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://www.tiktok.com/t/ZTNkBtxpp/'));
if (!m.args[0].includes('tiktok.com')) return m.reply(global.mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key);
try {
let res = await func.fetchJson(`https://api.agatz.xyz/api/tiktok?url=${m.args[0]}`);
if (res.status !== 200 || !res.data.status) return m.reply(global.mess.error.api);
if (!res.data.data || res.data.data.length === 0) return m.reply('Image not found.');
let data = res.data.data;
let txt = `乂  *T I K T O K - S L I D E*\n`;
txt += `\n◦ Title : ${res.data.title ?? 'Not Known'}`;
txt += `\n◦ Total Images : ${data.length}`;
txt += `\n\n_Please wait image is being sent..._`;
await mecha.sendMessage(m.chat, { text: txt }, { quoted: m, ephemeralExpiration: m.expiration }).then(async () => {
await mecha.sendMessage(m.chat, {
audio: {
url: res.data.music_info.url
},
mimetype: 'audio/mpeg',
ptt: false
}, {quoted: m, ephemeralExpiration: m.expiration});
// Send each image separately
for (let item of data) {
await mecha.sendMessage(m.chat, {
image: {
url: item.url
}
}, {quoted: m, ephemeralExpiration: m.expiration});
}
});
} catch (e) {
m.reply(global.mess.error.api);
return errorMessage(e);
}
},
limit: 5
};