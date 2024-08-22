const axios = require('axios');
const cheerio = require('cheerio');

async function livechart(type, musim, tahun) {
let { data } = await axios.get(`https://www.livechart.me/${musim}-${tahun}/${type}`);
const $ = cheerio.load(data);
const result = [];
$("#content > main > article:nth-child(n)").each((i, e) => {
const judul = $(e).find("div > h3 > a").text();
const image = $(e).find("div > div.poster-container > img").attr("src");
const studio = $(e).find("div > div.anime-info > ul > li > a").text();
const adaptasi = "Di adaptasi dari " + $(e).find("div > div.anime-info > div.anime-metadata > div.anime-source").text();
const rilisDate = $(e).find("div > div.poster-container > time").text();
const tags = [];
$(e).find("div > ol > li:nth-child(n)").each((i, b) => {
const a = $(b).find("a").text();
tags.push(a);
});
const linkInfo = $(e).find("div > ul > li:nth-child(2) > a").attr("href");
result.push({
judul,
tags,
image,
studio,
adaptasi,
rilisDate,
linkInfo
});
});
return result;
}

async function livechart2() {
let { data } = await axios.get('https://www.livechart.me/summer-2023/tv')
const $ = cheerio.load(data)
const result = []
$('#content > main > article:nth-child(n)').each((i, e) => {
const judul = $(e).find('div > h3 > a').text()
const image = $(e).find('div > div.poster-container > img').attr('src')
const studio = $(e).find('div > div.anime-info > ul > li > a').text()
const adaptasi = 'Di adaptasi dari ' + $(e).find('div > div.anime-info > div.anime-metadata > div.anime-source').text()
const rilisDate = $(e).find('div > div.poster-container > time').text()
const tags = []
$(e).find('div > ol > li:nth-child(n)').each((i, b) => {
const a = $(b).find('a').text()
tags.push(a)
})
const linkInfo = 'https://www.livechart.me' + $(e).find('div.anime-card > h3.main-title > a').attr('href')
result.push({
judul,
tags,
image,
studio,
adaptasi,
rilisDate,
linkInfo
});
});
return result
}

exports.run = {
usage: ['livechart'],
category: 'tools',
async: async (m, { func, mecha }) => {
if (!(m.args[0] || m.args[1] || m.args[2])) return m.reply(`${m.cmd} tipe musim tahun\n\nContoh: ${m.prefix + m.command} tv summer 2023`);
m.reply(global.mess.wait)
try {
await livechart(m.args[0], m.args[1], m.args[2]).then(data => {
let txt = `*Jadwal anime ${m.args[0]} musim ${m.args[1]} tahun ${m.args[2]}*`;
for (const [index, res] of data.entries()) {
txt += `\n\n*${index}. ${v.judul}*`
txt += `\n◦ Genre: ${res.tags.map(v => v).join(', ')}`
txt += `\n◦ Studio: ${res.studio}`
txt += `\n◦ Adaptasi: ${res.adaptasi}`
txt += `\n◦ Rilis Date: ${res.rilisDate ?? '-'}`
txt += `\n◦ Link Info: ${res.linkInfo}`
}
mecha.sendMessage(m.chat, {text: txt}, {quoted: m, ephemeralExpiration: m.expiration});
})
} catch (e) {
m.reply('Maaf terjadi kesalahan!');
}
/*let text = '乂  *L I V E  C H A R T*'
await livechart2().then(result => {
for (let [index, res] of result.entries()) {
text += `\n\n${index++}. ${res.judul}
◦  Genre: ${res.tags.map(v => v).join(', ')}
◦  Studio: ${res.studio}
◦  Adaptasi: ${res.adaptasi}
◦  Rilis Date: ${res.rilisDate ?? '-'}
◦  Link Info: ${res.linkInfo}`
}
mecha.reply(m.chat, text, m)
})*/
},
limit: true
}