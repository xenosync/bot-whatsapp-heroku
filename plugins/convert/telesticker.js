const axios = require('axios')

exports.run = {
usage: ['telesticker'],
hidden: ['telestick'],
use: 'link sticker telegram',
category: 'convert',
async: async (m, { func, mecha, packname, author }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'https://t.me/addstickers/Nekonyaaaa'))
if (!func.isUrl(m.args[0])) return m.reply(global.mess.invalid)
if (!m.args[0].includes('t.me')) return m.reply(global.mess.invalid)
m.reply(global.mess.wait)
await telesticker(m.args[0]).then(async (data) => {
for (let i of data) {
if (i.status == 200) {
await mecha.sendStickerFromUrl(m.chat, i.url, m, {
packname: packname, 
author: author,
expiration: m.expiration
})
await func.delay(1000)
} else m.reply('Salah satu sticker error!')
}
m.reply(global.mess.ok)
})
},
premium: true,
limit: true
}

async function telesticker(url) {
url = url.replace('https://t.me/addstickers/', '')
var data1 = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(url)}`)
const result = []
for (let i of data1.data.result.stickers) {
var data2 = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${i.thumb.file_id}`)
var link = data2.data.result.file_path
result.push({
status: data2.status, 
creator: 'SuryaDev', 
url: `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${link}`
});
};
return result
}