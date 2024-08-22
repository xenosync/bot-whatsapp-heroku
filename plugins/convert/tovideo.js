const FormData = require('form-data');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function webp2mp4File(path) {
return new Promise(async (resolve, reject) => {
try {
const BodyForm = new FormData()
BodyForm.append('new-image', fs.createReadStream(path));
BodyForm.append('new-image-url', '');
BodyForm.append('upload', 'Upload!');
await axios({
url: "https://ezgif.com/webp-to-mp4",
method: "POST",
headers: BodyForm.getHeaders(),
data: BodyForm
}).then(async response => {
const $ = cheerio.load(response.data);
const url = $('#target').attr('src');
const file = url.split('/tmp/')[1];
const form = new FormData();
form.append('file', file);
form.append('convert', 'Convert WebP to MP4');
await axios({
url: "https://ezgif.com/webp-to-mp4/" + file,
method: "POST",
headers: form.getHeaders(),
data: form
}).then(({ data, status }) => {
const $$ = cheerio.load(data)
const link = 'https:' + $$('.outfile').find('source').attr('src')
const result = {
status: true,
creator: 'SuryaDev',
url: link
}
resolve(result)
})
})
} catch (error) {
resolve({
status: false,
creator: 'SuryaDev',
msg: String(error)
})
}
})
}

exports.run = {
usage: ['tovideo'],
hidden: ['tomp4'],
use: 'reply sticker',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (/webp/.test(quoted.mime)){
mecha.sendReact(m.chat, '🕒', m.key)
let media = await mecha.downloadAndSaveMediaMessage(m)
let result = await webp2mp4File(media);
if (!result.status) return m.reply(result.msg);
await mecha.sendMessage(m.chat, {
video: {
url: result.url
},
caption: 'Convert Webp To Video'
}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(`Reply sticker nya dengan caption ${m.cmd}`)
},
limit: true
}