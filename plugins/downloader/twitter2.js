const qs = require('qs');
const cheerio = require('cheerio');
const axios = require('axios');

function twitter (link) {
return new Promise((resolve, reject) => {
let config = {
URL: link,
};
axios.post("https://twdown.net/download.php", qs.stringify(config), {
headers: {
accept:
"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
"sec-ch-ua":
'" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
cookie:
"_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1",
},
})
.then(({ data }) => {
const $ = cheerio.load(data);
resolve({
desc: $("div:nth-child(1) > div:nth-child(2) > p").text().trim(),
thumb: $("div:nth-child(1) > img").attr("src"),
video_sd: $("tr:nth-child(2) > td:nth-child(4) > a").attr("href"),
video_hd: $("tbody > tr:nth-child(1) > td:nth-child(4) > a").attr("href"),
audio: "https://twdown.net/" + $("body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a").attr("href"),
});
})
.catch(reject);
});
}

exports.run = {
usage: ['twitter2'],
hidden: ['tw2'],
use: 'url twitter',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://twitter.com/akila_syafina1/status/1739769718318465429?t=LtQmZUNU2_lUkLqi91-UTQ&s=19'))
if (!m.args[0].includes('twitter.com')) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
let data = await twitter(m.args[0])
await mecha.sendMedia(m.chat, data.video_hd, m, {
caption: data.desc,
expiration: m.expiration
})
},
limit: 5
}