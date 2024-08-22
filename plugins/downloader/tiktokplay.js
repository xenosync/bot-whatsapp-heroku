const axios = require('axios')

async function ttSearch(query) {
return new Promise(async (resolve, reject) => {
axios("https://tikwm.com/api/feed/search", {
headers: {
"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
cookie: "current_language=en",
"User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
},
data: {
keywords: query,
count: 12,
cursor: 0,
web: 1,
hd: 1,
},
method: "POST",
}).then((res) => {
resolve(res.data.data);
});
});
}

exports.run = {
usage: ['tiktokplay'],
hidden: ['ttplay'],
use: 'query',
category: 'downloader',
async: async (m, { func, mecha, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'story coding'))
mecha.sendReact(m.chat, '🕒', m.key)
try {
if (m.args[0] == '--audio') {
return mecha.sendMessage(m.chat, {
audio: {
url: m.args[1]
},
mimetype: 'audio/mpeg',
ptt: false
}, {quoted: m, ephemeralExpiration: m.expiration})
} else {
let search = await ttSearch(m.text)
let random = search.videos.random()
let body = `*• Title :* ${random.title}
*• Region :* ${random.region}
*• Duration :* ${random.duration} seconds
*• Total Views :* ${func.formatNumber(random.play_count)}
*• Total Likes :* ${func.formatNumber(random.digg_count)}
*• Author :* ${random.author.nickname}`
let button = [
['button', 'Download Audio', `${m.prefix}tiktokplay --audio ${'https://tikwm.com' + random.music}`],
]
await mecha.sendButton(m.chat, 'T I K T O K - P L A Y*', body, 'click the button below to download audio', button, m, {
media: 'https://tikwm.com' + random.play,
userJid: m.sender,
expiration: m.expiration
})
}
} catch(e) {
mecha.reply(m.chat, global.mess.error.api, m)
return errorMessage(e)
}
},
limit: 3
}