const axios = require('axios');
const cheerio = require('cheerio');

async function samehadaku(url) {
return new Promise(async (resolve, reject) => {
try {
if (!/samehadaku\.email/gi.test(url)) return reject("Invalid URL!");
const html = await fetch(url, {
method: "GET",
headers: {
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
},
});

if (!html.ok) return reject("Error Fetching");
const $ = cheerio.load(await html.text());
const data = {
title: $('h1[itemprop="name"]').text().trim(),
link: url,
downloads: [],
};

data.downloads = await Promise.all(
$("div#server > ul > li").map(async (i, el) => {
const v = {
name: $(el).find("span").text().trim(),
post: $(el).find("div").attr("data-post"),
nume: $(el).find("div").attr("data-nume"),
type: $(el).find("div").attr("data-type"),
link: "",
};

const A = new FormData();
A.append("action", "player_ajax");
A.append("post", v.post);
A.append("nume", v.nume);
A.append("type", v.type);

v.link = await fetch(
"https://samehadaku.email/wp-admin/admin-ajax.php",
{
method: "POST",
headers: {
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
origin: "https://samehadaku.email",
},
body: A,
}
)
.then((v) => v.text())
.then((v) => cheerio.load(v)("iframe").attr("src"));

return v;
})
);

return resolve(data);
} catch (e) {
reject(e);
}
});
}

exports.run = {
usage: ['samehadakudl'],
hidden: ['shdl'],
use: 'link samehadaku',
category: 'downloader',
async: async (m, { func, mecha }) => {
let url;
if (m.quoted && m.quoted.text) {
url = m.quoted.text.trim();
} else {
url = m.text.trim();
}
const samehadakuUrlPattern = /https:\/\/samehadaku\.email\/.+/gi;
if (!url) return m.reply(func.example(m.cmd, 'https://samehadaku.email/oshi-no-ko-season-2-episode-4/'));
if (!samehadakuUrlPattern.test(url)) return m.reply('Silakan berikan URL Samehadaku yang valid.');
await mecha.sendReact(m.chat, '🕒', m.key);
try {
const data = await samehadaku(url);
let downloadLinks = data.downloads.map((d, i) => `${i + 1}. ${d.name}: ${d.link}`).join('\n');
await mecha.sendMessage(m.chat, {
text: `*Judul:* ${data.title}\n*Link:* ${data.link}\n*Download Links:*\n${downloadLinks}`
}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (error) {
console.error(error);
m.reply('Gagal mengunduh video dari Samehadaku. Silakan coba lagi nanti.');
}
},
premium: true,
limit: 5
};