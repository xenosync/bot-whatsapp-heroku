const fetch = require('node-fetch');

async function GDriveDl(url) {
let id
if (!(url && url.match(/drive\.google/i))) return m.reply('Invalid URL')
id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
if (!id) return m.reply('ID Not Found')
let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
method: 'post',
headers: {
'accept-encoding': 'gzip, deflate, br',
'content-length': 0,
'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
'origin': 'https://drive.google.com',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
'x-drive-first-party': 'DriveWebUi',
'x-json-requested': 'true'
}
})
let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4))
if (!downloadUrl) return m.reply('Link Download Limit!')
let data = await fetch(downloadUrl)
if (data.status !== 200) return m.reply(data.statusText)
return {
downloadUrl,
fileName,
fileSize: func.formatSize(sizeBytes),
mimetype: data.headers.get('content-type')
}
}

exports.run = {
usage: ['googledrive'],
hidden: ['gdrive'],
use: 'link google drive',
category: 'downloader',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply('Masukkan link google drive yang ingin di download.')
if (!m.args[0].includes('drive.google.com')) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
await GDriveDl(m.args[0]).then(async (res) => {
let txt = `乂  *GOOGLE DRIVE DOWNLOADER*\n`
txt += `\nfileName: ${res.fileName}`
txt += `\nfileSize: ${res.fileSize}`
txt += `\nmimetype: ${res.mimetype}`
txt += `\n\n_Please wait media is being sent..._`
mecha.reply(m.chat, txt, m)
await mecha.sendMedia(m.chat, res.downloadUrl, m, {
caption: global.mess.ok,
fileName: res.fileName,
expiration: m.expiration
})
}).catch((e) => m.reply('Bot tidak memiliki akses ke GoogleDrive ini'))
},
premium: true,
limit: true
}