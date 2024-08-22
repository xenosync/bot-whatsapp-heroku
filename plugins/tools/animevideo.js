const cheerio = require('cheerio'),
fetch = require('node-fetch');

exports.run = {
usage: ['animevideo'],
hidden: ['amv'],
use: '1 or 2',
category: 'anime',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '1 or 2'))
if (!['1', '2'].includes(m.args[0])) return m.reply('Input 1 or 2')
mecha.sendReact(m.chat, '🕒', m.key)
try {
let result;
if (m.text == '1') result = await animeVideo()
else if (m.text == '2') result = await animeVideo2()
await mecha.sendButton(m.chat, '', result.title, 'click the button for the next video', button, m, {
media: result.source,
userJid: m.sender,
expiration: m.expiration
})
} catch (e) {
await mecha.reply(m.chat, global.mess.error.api, m)
}
},
limit: true
}

async function animeVideo() {
const url = 'https://shortstatusvideos.com/anime-video-status-download/'; // Ganti dengan URL yang sesuai
const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);
const videos = [];
$('a.mks_button.mks_button_small.squared').each((index, element) => {
const href = $(element).attr('href');
const title = $(element).closest('p').prevAll('p').find('strong').text();
videos.push({
title,
source: href
});
});

const randomIndex = Math.floor(Math.random() * videos.length);
const randomVideo = videos[randomIndex];

return randomVideo;
}

async function animeVideo2() {
const url = 'https://mobstatus.com/anime-whatsapp-status-video/'; // Ganti dengan URL yang sesuai
const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);
const videos = [];
const title = $('strong').text();
$('a.mb-button.mb-style-glass.mb-size-tiny.mb-corners-pill.mb-text-style-heavy').each((index, element) => {
const href = $(element).attr('href');
videos.push({
title,
source: href
});
});

const randomIndex = Math.floor(Math.random() * videos.length);
const randomVideo = videos[randomIndex];

return randomVideo;
}