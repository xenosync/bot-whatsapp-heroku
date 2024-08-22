const formData = require('form-data'),
axios = require('axios'),
cheerio = require('cheerio');

async function tiktok3(url) {
let result = {};
const bodyForm = new formData();
bodyForm.append("q", url);
bodyForm.append("lang", "id");
try {
const { data } = await axios(`https://savetik.co/api/ajaxSearch`, {
method: "post",
data: bodyForm,
headers: {
"content-type": "application/x-www-form-urlencoded",
"User-Agent": "PostmanRuntime/7.32.2",
},
});
const $ = cheerio.load(data.data);
result.status = true;
result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text();
(result.videoSD = {
quality: "MEDIUM",
url: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href"),
}),
(result.videoHD = {
quality: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").text().split("MP4 ")[1],
url: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href"),
}),
(result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href"));
return result;
} catch (err) {
result.status = false;
result.message = String(err);
console.log(result);
return result;
}
}

exports.run = {
usage: ['tiktok3'],
hidden: ['tt3'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSF4cWcA2/'))
if (!m.args[0].includes('tiktok.com')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await tiktok3(m.args[0]).then(data => {
if (!data.status) return m.reply(data.message)
let result = data.videoSD;
let txt = '乂  *TIKTOK - DOWNLOADER*\n'
txt += `\n◦  *Title* : ${data.caption}`
txt += `\n◦  *Quality* : ${result?.quality}`
mecha.sendMessage(m.chat, {
video: {
url: result.url
}, 
caption: txt
}, {quoted: m, ephemeralExpiration: m.expiration})
.then((q) => mecha.sendMessage(m.chat, {audio: {url: data.audio}, mimetype: 'audio/mpeg', ptt: false}, {quoted: q, ephemeralExpiration: m.expiration}))
}).catch((err) => m.reply(String(err)))
},
limit: 5
}