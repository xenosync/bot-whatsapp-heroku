const axios = require('axios');
const cheerio = require('cheerio');

async function drive(url) {
try {
if (!/drive\.google\.com\/file\/d\//gi.test(url)) {
throw new Error("Invalid URL");
}

const response = await axios.get(url);
const $ = cheerio.load(response.data);

const id = url.split("/")[5];
const data = {
name: $("head").find("title").text()?.split("-")[0]?.trim() ?? "",
download: `https://drive.google.com/uc?id=${id}&export=download`,
link: url,
};

return data;
} catch (error) {
throw error;
}
}

exports.run = {
usage: ['drive'],
hidden: ['drivedl'],
use: 'link drive',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'link'));
try {
let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
const driveData = await drive(m.text);
await mecha.sendMessage(m.chat, { text: JSON.stringify(driveData, null, 2), edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
} catch (e) {
console.error('Download Error:', e);
await mecha.sendMessage(m.chat, { text: `Internal Error: ${e.message}`, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
}
},
limit: 3
}