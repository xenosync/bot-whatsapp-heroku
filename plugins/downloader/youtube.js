exports.run = {
usage: ['ytmp3', 'ytmp4'],
hidden: ['yta', 'ytv'],
use: 'link',
category: 'downloader',
async: async (m, { func, mecha, YT }) => {
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
try {
if (/yt?(a|mp3)/i.test(m.command)) {
if (!m.args || !m.args[0]) return m.reply(func.example(m.cmd, 'https://youtu.be/1fOBgosDo7s?si=_8VLb2NqwyICoEhY'));
if (!youtubeRegex.test(m.args[0])) return m.reply(global.mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key);
const result = await YT.getmp3(m.args[0])
mecha.sendMessage(m.chat, {
audio: {
url: result.audio
},
mimetype: 'audio/mpeg'
}, {quoted: m, ephemeralExpiration: m.expiration})
} else if (/yt?(v|mp4)/i.test(m.command)) {
if (!m.args || !m.args[0]) return m.reply(func.example(m.cmd, 'https://youtu.be/1fOBgosDo7s?si=_8VLb2NqwyICoEhY'));
if (!youtubeRegex.test(m.args[0])) return m.reply(global.mess.error.url);
mecha.sendReact(m.chat, '🕒', m.key);
const result = await YT.getmp4(m.args[0])
mecha.sendMessage(m.chat, {
video: {
url: result.video
},
caption: result.title
}, {quoted: m, ephemeralExpiration: m.expiration})
}
} catch (e) {
console.error(e); // Log kesalahan untuk debugging
return mecha.reply(m.chat, func.jsonFormat(e), m);
}
},
limit: 3
}