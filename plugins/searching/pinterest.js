const axios = require('axios');
const cheerio = require('cheerio');

async function pinterest(query) {
return new Promise(async (resolve, reject) => {
await axios.get("https://ar.pinterest.com/search/pins/?autologin=true&q=" + query, {
headers: {
'sec-ch-ua': "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
'cookie': "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0",
'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
}
}).then(({ data }) => {
const $ = cheerio.load(data)
const result = [];
const hasil = [];
$('div > a').get().map(b => {
const link = $(b).find('img').attr('src')
result.push(link)
});
result.forEach(v => {
if (v == undefined) return
hasil.push(v.replace(/236/g,'736'))
})
hasil.shift();
resolve(hasil)
})
})
}

exports.run = {
usage: ['pinterest'],
hidden: ['pin'],
use: 'text',
category: 'searching',
async: async (m, { func, mecha, isPrem }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'nakano miku'))
if (m.text.startsWith('@62')) return m.reply('Stress ??')
mecha.sendReact(m.chat, '🕒', m.key)
let text = '```Result from:```' + '\t`' + m.text + '`'
if (isPrem) {
function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const rand = Math.floor(Math.random() * (i + 1));
[array[i], array[rand]] = [array[rand], array[i]];
}
}
let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${m.text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${m.text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
let array = data.resource_response.data.results.map(v => v.images.orig.url);
shuffleArray(array); // Mengacak array
let result = array.splice(0, 10); // Mengambil 10 gambar pertama dari array yang sudah diacak
if (result.length == 0) return m.reply('Tidak ditemukan.')
await m.reply(`ditemukan *${result.length}* photo, wait sedang dikirim...`)
for (let [index, url] of result.entries()) {
await func.delay(500)
mecha.sendMessage(m.chat, {
image: {
url: url
},
caption: `${result.length > 1 ? `Image *(${index + 1}/${result.length})*` : global.mess.ok}`
}, {quoted: m, ephemeralExpiration: m.expiration})
}
} else {
const data = await pinterest(m.text)
let url = data[Math.floor(Math.random() * data.length)]
mecha.sendMessage(m.chat, {
image: {
url: url
},
caption: text
}, {quoted: m, ephemeralExpiration: m.expiration})
}
},
//premium: true,
restrict: true,
limit: 3
}