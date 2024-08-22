const fetch = require('node-fetch');

exports.run = {
usage: ['prompt'],
use: 'query',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
let text;
if (m.args.length >= 1) {
text = m.args.slice(0).join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else return m.reply(func.example(m.cmd, 'halo'));
let { key } = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
if (/image\/(png|jpe?g)/.test(quoted.mime)) {
try {
let media = await mecha.downloadAndSaveMediaMessage(m);
let anu = await func.UploadFileUgu(media);
let res = await generateImagePrompt(text, anu.url);
if (!res.response) return m.reply(res.message);
await mecha.sendMessage(m.chat, {
text: `${res.response}`,
edit: key
}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (error) {
return m.reply(String(error));
}
} else {
try {
let res = await generateTextPrompt(text);
await mecha.sendMessage(m.chat, {
text: `${res.response}`,
edit: key
}, { quoted: m, ephemeralExpiration: m.expiration });
} catch (error) {
return m.reply(String(error));
}
}
},
premium: true
};

async function generateTextPrompt(query) {
return (await fetch(`https://api.vyturex.com/prompt?p=${encodeURIComponent(query)}`)).json();
}

async function generateImagePrompt(query, url) {
return (await fetch(`https://api.vyturex.com/prompt?p=${encodeURIComponent(query)}&url=${encodeURIComponent(url)}`)).json();
}