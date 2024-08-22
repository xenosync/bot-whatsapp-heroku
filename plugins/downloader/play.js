const yts = require('yt-search');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function youtube(url) {
try {
const response = await fetch(`https://suryadev.vercel.app/api/youtube?url=${url}`);
const result = await response.json();
return result;
} catch (err) {
return {
status: false,
developer: 'SuryaDev',
message: String(err)
}
}
}

exports.run = {
usage: ['play'],
use: 'judul lagu',
category: 'downloader',
async: async (m, { func, mecha, YT }) => {
mecha.play = mecha.play ? mecha.play : {}
if (!m.text) return m.reply(func.example(m.cmd, 'melukis senja'))
mecha.sendReact(m.chat, '🕒', m.key)
var search = await yts(m.text);
var convert = search.videos[0];
if (!convert) return m.reply('Video/Audio tidak ditemukan.');
if (convert.seconds >= 3600) {
return mecha.reply(m.chat, 'Video is longer than 1 hour!', m);
} else {
let caption = `∘ ID : ${convert.videoId}`;
caption += `\n∘ Title : ${convert.title}`;
caption += `\n∘ Duration : ${convert.timestamp}`;
caption += `\n∘ Views : ${convert.views}`;
caption += `\n∘ Upload : ${convert.ago}`;
caption += `\n∘ Author : ${convert.author.name}`;
caption += `\n∘ Channel : ${convert.author.url}`;
caption += `\n∘ Video URL : ${convert.url}`;
caption += `\n∘ Description : ${convert.description}`;
caption += `\n\n_reply with number *1* to get audio_`
caption += `\n_reply with number *2* to get video_`
caption += `\n_reply with number *3* to get document_`
const data = await youtube(convert.url);
if (!data.status) return m.reply('Terjadi kesalahan saat mengambil data downloader:\n' + data.message)
const videoBuffer = await func.fetchBuffer(data.result.video.url);
let videoPath = `./media/${func.filename('mp4')}`;
await fs.writeFileSync(videoPath, videoBuffer);
let audioPath = path.join(process.cwd(), 'media', func.filename('mp3'));
exec(`ffmpeg -i ${videoPath} ${audioPath}`, async (err) => {
if (err) return m.reply(global.mess.error.api)
mecha.play[m.sender] = {
data: {
url: convert.url,
thumbnail: convert.image,
duration: convert.timestamp,
title: convert.title,
audio: fs.readFileSync(audioPath),
video: videoBuffer
},
audio: true,
video: true,
document: true,
timeout: setTimeout(function () {
delete mecha.play[m.sender]
}, 1000 * 60 * 10)
}
let messageId = 'MECHA' + func.makeid(22).toUpperCase() + 'PLAY'
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
}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId}).then(() => {
fs.unlinkSync(videoPath)
fs.unlinkSync(audioPath)
})
})
}
},
main: async (m, { func, mecha }) => {
mecha.play = mecha.play ? mecha.play : {}
if (mecha.play[m.sender] && m.budy && m.quoted && m.quoted.fromMe && m.quoted.id.endsWith('PLAY') && !m.isPrefix) {
if (!isNaN(m.budy) && func.somematch(['1', '2', '3'], m.budy)) {
mecha.sendReact(m.chat, '🕒', m.key)
let result = mecha.play[m.sender];
let typefile = /1/.test(m.budy) ? 'audio' : /2/.test(m.budy) ? 'video' : 'document';
let ext = /1/.test(m.budy) ? '.mp3' : /2/.test(m.budy) ? '.mp4' : '.mp3';
let mimetype = /1/.test(m.budy) ? 'audio/mpeg' : /2/.test(m.budy) ? 'video/mp4' : 'audio/mpeg';
await mecha.sendMessage(m.chat, {
[typefile]: /1/.test(m.budy) ? Buffer.from(result.data.audio, 'base64') : /2/.test(m.budy) ? Buffer.from(result.data.video, 'base64') : Buffer.from(result.data.audio, 'base64'),
caption: result.data.title,
mimetype: mimetype, 
fileName: result.data.title + ext,
contextInfo: {
externalAdReply: {
title: result.data.title, 
body: `${result.data.duration}`, 
thumbnail: await mecha.resize(result.data.thumbnail, 300, 175),
thumbnailUrl: result.data.thumbnail,
mediaType: 2, 
mediaUrl: result.data.url, 
sourceUrl: result.data.url
}
}
}, {quoted: m, ephemeralExpiration: m.expiration}).then(_ => {
result[typefile] = false;
if (!result.audio && !result.video && !result.document) delete mecha.play[m.sender]
})
}
}
},
restrict: true,
limit: 3
}