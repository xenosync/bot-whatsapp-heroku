let axios = require('axios')

exports.run = {
usage: ['jadianime'],
hidden: ['toanime'],
use: 'reply photo',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
if (/image\/(jpe?g|png)/.test(quoted.mime)) {
let media = await quoted.download()
mecha.sendReact(m.chat, '🕒', m.key)
try {
const openAIResponse = await processImageAndUpload(media);
if (openAIResponse) {
const result = openAIResponse;
await mecha.sendMessage(m.chat, {
image: {
url: result
},
caption: global.mess.ok,
mentions: [m.sender]
}, {quoted: m, ephemeralExpiration: m.expiration});
} else {
console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
}
} catch (e) {
await mecha.reply(m.chat, global.mess.error.api, m)
}
} else m.reply(`Kirim/Reply foto dengan caption ${m.cmd}`)
},
premium: true
}

async function processImageAndUpload(buffer) {
try {
const base64String = Buffer.from(buffer, 'binary').toString('base64');
const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
data: `data:image/png;base64,${base64String}`,
}, {
headers: {
'Content-Type': 'application/json',
},
});
return 'https://www.drawever.com' + apiResponse.data.urls[1] || 'https://www.drawever.com' + apiResponse.data.urls[0];
} catch (error) {
throw error;
}
}