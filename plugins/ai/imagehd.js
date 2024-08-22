const FormData = require('form-data');

async function processing(urlPath, method) {
return new Promise(async (resolve, reject) => {
let Methods = ["enhance", "recolor", "dehaze"];
Methods.includes(method) ? (method = method) : (method = Methods[0]);
let buffer,
Form = new FormData(),
scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
Form.append("model_version", 1, {
"Content-Transfer-Encoding": "binary",
contentType: "multipart/form-data; charset=uttf-8",
});
Form.append("image", Buffer.from(urlPath), {
filename: "enhance_image_body.jpg",
contentType: "image/jpeg",
});
Form.submit({
url: scheme,
host: "inferenceengine" + ".vyro" + ".ai",
path: "/" + method,
protocol: "https:",
headers: {
"User-Agent": "okhttp/4.9.3",
Connection: "Keep-Alive",
"Accept-Encoding": "gzip",
},
},
function (err, res) {
if (err) reject();
let data = [];
res
.on("data", function (chunk, resp) {
data.push(chunk);
})
.on("end", () => {
resolve(Buffer.concat(data));
});
res.on("error", (e) => {
reject();
});
}
);
});
}

exports.run = {
usage: ['enhancer', 'recolor', 'hdr'],
use: 'reply photo',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
switch (m.command) {
case 'enhancer':{
mecha.enhancer = mecha.enhancer ? mecha.enhancer : {};
if (m.sender in mecha.enhancer) return m.reply('Masih ada proses yang sedang dijalankan, silahkan tunggu.');
if (!quoted.mime) return m.reply(`Kirim/Reply gambar dengan caption ${m.cmd}`);
if (!/image\/(jpe?g|png|video)/.test(quoted.mime)) return m.reply(`Mime ${quoted.mime} tidak support`);
else mecha.enhancer[m.sender] = true;
mecha.sendReact(m.chat, '🕒', m.key)
let media = await quoted.download?.();
try {
const result = await processing(media, 'dehaze');
mecha.sendMedia(m.chat, result, m, {
caption: global.mess.ok,
expiration: m.expiration
});
delete mecha.enhancer[m.sender];
} catch (err) {
m.reply('Maaf terjadi kesalahan.');
delete mecha.enhancer[m.sender];
}
}
break;
case 'recolor':{
mecha.recolor = mecha.recolor ? mecha.recolor : {};
if (m.sender in mecha.recolor) return m.reply('Masih ada proses yang sedang dijalankan, silahkan tunggu.');
if (!quoted.mime) return m.reply(`Kirim/Reply gambar dengan caption ${m.cmd}`);
if (!/image\/(jpe?g|png|video)/.test(quoted.mime)) return m.reply(`Mime ${quoted.mime} tidak support`);
else mecha.recolor[m.sender] = true;
mecha.sendReact(m.chat, '🕒', m.key)
let media = await quoted.download?.();
try {
const result = await processing(media, 'recolor');
mecha.sendMedia(m.chat, result, m, {
caption: global.mess.ok,
expiration: m.expiration
});
delete mecha.recolor[m.chat];
} catch (err) {
m.reply('Maaf terjadi kesalahan.');
delete mecha.recolor[m.chat];
}
}
break;
case 'hdr':{
mecha.hdr = mecha.hdr ? mecha.hdr : {};
if (m.sender in mecha.hdr) return m.reply('Masih ada proses yang sedang dijalankan, silahkan tunggu.');
if (!quoted.mime) return m.reply(`Kirim/Reply gambar dengan caption ${m.cmd}`);
if (!/image\/(jpe?g|png|video)/.test(quoted.mime)) return m.reply(`Mime ${quoted.mime} tidak support`);
else mecha.hdr[m.sender] = true;
mecha.sendReact(m.chat, '🕒', m.key)
let media = await quoted.download?.();
try {
const result = await processing(media, 'enhance');
mecha.sendMedia(m.chat, result, m, {
caption: global.mess.ok,
expiration: m.expiration
});
delete mecha.hdr[m.sender];
} catch (err) {
m.reply('Maaf terjadi kesalahan.');
delete mecha.hdr[m.sender];
}
}
break;
}
},
premium: true
}