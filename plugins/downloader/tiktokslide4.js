const axios = require('axios');
const cheerio = require('cheerio');

async function ttSlide(url) {
try {
const response = await axios.post('https://ttsave.app/download', {
query: url,
language_id: '2'
}, {
headers: {
'Accept': 'application/json, text/plain, */*',
'Content-Type': 'application/json'
}
});

const html = response.data;
const $ = cheerio.load(html);

const uniqueId = $('#unique-id').val();
const username = $('h2.font-extrabold.text-xl.text-center').text();
const thumbnail = $('a[target="_blank"]').attr('href');
const profile = $('img.h-24.w-34.rounded-full').attr('src');
const description = $('p.text-gray-600.px-2.text-center.break-all.w-3/4.oneliner').text();

const stats = {
views: $('svg.h-5.w-5.text-gray-500 + span').text(),
likes: $('svg.h-5.w-5.text-red-500 + span').text(),
comments: $('svg.h-5.w-5.text-green-500 + span').text(),
shares: $('svg.h-5.w-5.text-yellow-500 + span').text(),
downloads: $('svg.h-5.w-5.text-blue-500 + span').text()
};

const download = [];
$('a[onclick="bdl(this, event)"]').each((i, elem) => {
const link = $(elem).attr('href');
const type = $(elem).attr('type');
const title = $(elem).text().trim();
download.push({ link, type, title });
});

return {
uniqueId,
username,
thumbnail,
profile,
description,
stats,
download,
};
} catch (error) {
console.error(error);
throw error;
}
}

exports.run = {
usage: ['tiktokslide4'],
hidden: ['ttslide4'],
use: 'link tiktok',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://vt.tiktok.com/ZSYYYW4tk/'));
if (!m.args[0].includes('tiktok.com')) return m.reply(mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key);
try {
let data = await ttSlide(m.args[0]);
if (data.download.length == 0) return m.reply('Empty data.');
let audio = data.download.find(v => v.type == 'audio');
let slide = data.download.filter(v => v.type == 'slide');
let stats = data.stats;
let txt = `乂  *T I K T O K - S L I D E*\n`;
txt += `\n- Username : ${data.username}`;
txt += `\nUniqueId : ${data.uniqueId}`;
txt += `\n- Views : ${stats.views ?? '-'}`;
txt += `\n- Likes : ${stats.likes ?? '-'}`;
txt += `\n- Comments : ${stats.comments ?? '-'}`;
txt += `\n- Shares : ${stats.shares ?? '-'}`;
txt += `\n- Downloads : ${stats.downloads ?? '-'}`;
txt += `\n- Total Images : ${slide.length}`;
txt += `\n\n_Please wait image is being sent..._`;
await mecha.sendMessage(m.chat, { text: txt }, { quoted: m, ephemeralExpiration: m.expiration }).then(async () => {
if (audio) await mecha.sendMessage(m.chat, {
audio: {
url: audio.link
},
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: m, ephemeralExpiration: m.expiration });
if (slide.length == 0) return m.reply('Image not found.');
for (let i of slide) {
mecha.sendMessage(m.chat, {
image: {
url: i.link
}
}, { ephemeralExpiration: m.expiration });
await func.delay(1000);
}
});
} catch (e) {
console.error(e);
return mecha.reply(m.chat, String(e), m);
}
},
limit: 5
};