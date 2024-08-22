const axios = require('axios'),
cheerio = require('cheerio');

function tiktok2(query) {
return new Promise(async (resolve, reject) => {
try {
const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');
const response = await axios({
method: 'POST',
url: 'https://tikwm.com/api/',
headers: {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Cookie': 'current_language=en',
'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
},
data: encodedParams
});
const videos = response.data.data;
const result = {
title: videos.title,
cover: videos.cover,
origin_cover: videos.origin_cover,
no_watermark: videos.play,
watermark: videos.wmplay,
music: videos.music
};
resolve(result);
} catch (error) {
reject(error);
}
});
}

exports.run = {
usage: ['tiktok2'],
hidden: ['tt2'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSF4cWcA2/'))
if (!m.args[0].includes('tiktok.com')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await tiktok2(m.args[0]).then(data => {
let txt = '乂  *TIKTOK - DOWNLOADER*\n'
txt += `\n◦  *Title* : ${data.title}`
txt += `\n◦  *Quality* : MEDIUM`
mecha.sendMessage(m.chat, {
video: {
url: data.no_watermark
}, 
caption: txt
}, {quoted: m, ephemeralExpiration: m.expiration})
.then((q) => mecha.sendMessage(m.chat, {audio: {url: data.music}, mimetype: 'audio/mpeg', ptt: false}, {quoted: q, ephemeralExpiration: m.expiration}))
}).catch((err) => m.reply('Maaf terjadi kesalahan.'))
},
limit: 5
}