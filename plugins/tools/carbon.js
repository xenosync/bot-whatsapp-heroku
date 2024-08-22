const fetch = require('node-fetch');

exports.run = {
usage: ['carbon'],
category: 'tools',
async: async (m, { func, mecha }) => {
let text;
if (m.args.length >= 1) {
text = m.args.slice(0).join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else return m.reply(func.example(m.cmd, 'query'))
mecha.sendReact(m.chat, '🕒', m.key)
await CarbonifyV1(text)
.then((result) => {
return mecha.sendMedia(m.chat, result, m, {caption: global.mess.ok, expiration: m.expiration});
})
.catch(() => {
return CarbonifyV2(text)
.then((result) => {
return mecha.sendMedia(m.chat, result, m, {caption: global.mess.ok, expiration: m.expiration});
})
.catch((error) => {
return m.reply(String(error))
});
});
}, 
limit: true
}

async function CarbonifyV1(input) {
let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
code: input,
}),
}).then((response) => response.blob());
let arrayBuffer = await Blobs.arrayBuffer();
let buffer = Buffer.from(arrayBuffer);
return buffer;
}

async function CarbonifyV2(input) {
let Blobs = await fetch("https://carbon-api.vercel.app/api", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
code: input,
}),
}).then((response) => response.blob());
let arrayBuffer = await Blobs.arrayBuffer();
let buffer = Buffer.from(arrayBuffer);
return buffer;
}