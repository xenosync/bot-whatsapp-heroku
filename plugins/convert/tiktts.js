const axios = require('axios');

exports.run = {
usage: ['tiktts'],
use: 'text',
category: 'convert',
async: async (m, { func, mecha, errorMessage }) => {
let text
if (m.args.length >= 1) {
text = m.args.slice(0).join(' ')
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else return m.reply('Input atau reply text!')
if (!text) return mecha.reply(m.chat, func.example(m.cmd, 'aku sayang kamu'), m)
if (func.isNumber(text)) return m.reply('Teks harus berupa huruf.')
mecha.sendReact(m.chat, '🕒', m.key)
await tiktokTts(text, 'id_001').then(async result => {
await mecha.sendMessage(m.chat, {audio: result, mimetype: 'audio/mp4', ptt: true}, {quoted: m, ephemeralExpiration: m.expiration})
}).catch((e) => {
m.reply(global.mess.error.api)
return errorMessage(e)
})
},
limit: 3,
restrict: true
}

async function tiktokTts(text, model) {
try {
const modelVoice = model ? model : 'en_us_001';
const { status, data } = await axios('https://tiktok-tts.weilnet.workers.dev/api/generation', {
method: "post",
data: { text: text, voice: modelVoice },
headers: {
"content-type": "application/json",
},
}
);
return Buffer.from(data.data, "base64");
} catch (err) {
console.log(err.response.data);
return err.response.data;
}
}