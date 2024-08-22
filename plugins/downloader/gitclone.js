const fetch = require('node-fetch');

exports.run = {
usage: ['gitclone'],
use: 'link repository',
category: 'downloader',
async: async (m, { func, mecha }) => {
let regx = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
if (!m.text) return m.reply('Masukkan link repository nya!')
if (!regx.test(m.args[0])) return m.reply(global.mess.error.url)
mecha.sendReact(m.chat, '🕒', m.key)
try {
let [_, usr, repo] = m.args[0].match(regx) || []
let repos = repo.replace(/.git$/, '')
let result = `https://api.github.com/repos/${usr}/${repos}/zipball`
let namafile = (await fetch(result, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
mecha.sendMessage(m.chat, {
document: {
url: result
}, 
mimetype: 'application/zip', 
fileName: namafile
}, {quoted: m, ephemeralExpiration: m.expiration})
} catch (e) {
return await m.reply('Repository tersebut diprivate.')
}
},
//premium: true,
limit: 5
}