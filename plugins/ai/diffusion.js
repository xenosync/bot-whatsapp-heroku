const fetch = require('node-fetch');

exports.run = {
usage: ['diffusion'],
hidden: ['df'],
use: 'prompt',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
let text;
let negative = "not hd, watermark";
if (m.args.length >= 1) {
text = m.args.slice(0).join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else return m.reply(func.example(m.cmd, 'halo'));
mecha.sendReact(m.chat, '🕒', m.key)
try {
let res = await stableDiff(text, negative);
if (!res.images || res.images.length === 0) return m.reply("No images generated.");
await mecha.sendMedia(m.chat, res.images[0].url, null, {
expiration: m.expiration
});
} catch (error) {
return m.reply(String(error));
}
},
premium: true
};

async function stableDiff(prompt, negative) {
return new Promise(async (resolve, reject) => {
try {
const res = await fetch(
"https://requesteracessibili.joaovitorkas13.workers.dev",
{
method: "POST",
headers: {
authority: "requesteracessibili.joaovitorkas13.workers.dev",
"content-type": "application/json",
origin: "https://just4demo24.blogspot.com",
referer: "https://just4demo24.blogspot.com/",
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
},
body: JSON.stringify({
prompt: prompt,
negative_prompt: negative,
sync_mode: 1,
}),
}
).then((v) => v.json());
resolve(res);
} catch (e) {
reject(e);
}
});
}