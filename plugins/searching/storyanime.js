const cheerio = require('cheerio');
const fetch = require('node-fetch');

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

exports.run = {
usage: ['storyanime'],
category: 'tools',
async: async (m, { func, mecha }) => {
mecha.sendReact(m.chat, '🕒', m.key)
await animeVideo().then(res => {
mecha.sendMessage(m.chat, {
video: {
url: res.source
},
caption: res.title, 
mimetype: 'video/mp4'
}, {quoted: m, ephemeralExpiration: m.expiration})
})
},
limit: true
}