const axios = require('axios')
const cheerio = require('cheerio')

function cocofun(url){
return new Promise((resolve, reject) => {
axios({url, method: 'GET',
headers: {
"Cookie": "client_id=1a5afdcd-5574-4cfd-b43b-b30ad14c230e",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
}
}).then(data => {
$ = cheerio.load(data.data)
let json
const res = $('script#appState').get()
for (let i of res){
if (i.children && i.children[0] && i.children[0].data){
ress = i.children[0].data.split('window.APP_INITIAL_STATE=')[1]
json = JSON.parse(ress)
}
const result = {
status: true,
author: "SuryaDev",
topic: json.share.post.post.content ? json.share.post.post.content : json.share.post.post.topic.topic,
caption: $("meta[property='og:description']").attr('content'),
play: json.share.post.post.playCount,
like: json.share.post.post.likes,
share: json.share.post.post.share,
duration: json.share.post.post.videos[json.share.post.post.imgs[0].id].dur,
thumbnail: json.share.post.post.videos[json.share.post.post.imgs[0].id].coverUrls[0],
watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].urlwm,
no_watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].url
}
resolve(result)
}
}).catch((e) => {
reject({ status: false, msg: e })
})
})
}

exports.run = {
usage: ['cocofun'],
hidden: ['cfdl'],
use: 'url cocofun',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://www.icocofun.com/share/post/563581394924?lang=id&pkg=id&share_to=copy_link&m=9ea7e4fe53df856c19f852d10c8fb399&d=fc00297cf49aa27ba9c78a51c5a85374e33686b046853c81942475a52fd33bb8&nt=4'))
if (!m.args[0].includes('cocofun.com')) return m.reply(mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await cocofun(m.args[0]).then(async res => {
if (!res.status) return m.reply(global.mess.error.api)
let caption = `乂  COCOFUN DOWNLOADER

◦ Topic: ${res.topic}
◦ Caption: ${res.caption}
◦ Play: ${res.play}
◦ Like: ${res.like}
◦ Share: ${res.share}
◦ Duration: ${res.duration}

_Please wait video is being sent..._`

await mecha.sendMessageModify(m.chat, caption, m, {
title: 'COCOFUN DOWNLOADER',
body: global.header, 
thumbnailUrl: res.thumbnail,
thumbnail: await func.fetchBuffer(res.thumbnail),
largeThumb: true
}).then(msg => mecha.sendMedia(m.chat, res.no_watermark, m, { caption: global.mess.ok, expiration: m.expiration }))
//await mecha.sendMessage(m.chat, {video: {url: res.no_watermark}, caption: global.mess.ok}, {quoted: m, ephemeralExpiration: m.expiration})
})
},
premium: true,
limit: true
}