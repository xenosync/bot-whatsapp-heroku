const yts = require("yt-search");

exports.run = {
usage: ['play2'],
hidden: ['song'],
use: 'judul lagu',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'legends never die'));
mecha.sendReact(m.chat, '🕒', m.key);
try {
var search = await yts(m.text);
var convert = search.videos[0];
if (!convert) return m.reply('Video/Audio tidak ditemukan.');
if (convert.seconds >= 3600) {
return mecha.reply(m.chat, 'Video is longer than 1 hour!', m);
} else {
var audioUrl = `https://widipe.com/downloadAudio?URL=${convert.url}&videoName=ytdl`;

let caption = `∘ ID : ${convert.videoId}`;
caption += `\n∘ Title : ${convert.title}`;
caption += `\n∘ Duration : ${convert.timestamp}`;
caption += `\n∘ Views : ${convert.views}`;
caption += `\n∘ Upload : ${convert.ago}`;
caption += `\n∘ Author : ${convert.author.name}`;
caption += `\n∘ Channel : ${convert.author.url}`;
caption += `\n∘ Video URL : ${convert.url}`;
caption += `\n∘ Description : ${convert.description}`;
caption += `\n\nPlease wait, the audio file is being sent...`;

await mecha.relayMessage(m.chat, {
extendedTextMessage: {
text: caption,
contextInfo: {
externalAdReply: {
title: convert.title,
mediaType: 1,
previewType: 0,
renderLargerThumbnail: true,
thumbnailUrl: convert.image,
sourceUrl: convert.url
}
},
mentions: [m.sender]
}
}, { quoted: m, ephemeralExpiration: m.expiration });
await mecha.sendMessage(m.chat, {
audio: { url: audioUrl },
mimetype: 'audio/mpeg',
fileName: `${convert.title}.mp3`,
contextInfo: {
externalAdReply: {
title: convert.title,
body: global.header,
thumbnailUrl: convert.image,
sourceUrl: convert.url,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
}
}
}, { quoted: m, ephemeralExpiration: m.expiration });
}
} catch (e) {
mecha.reply(m.chat, String(e), m);
}
},
limit: 3
};