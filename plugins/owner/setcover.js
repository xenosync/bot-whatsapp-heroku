exports.run = {
usage: ['setcover'],
hidden: ['cover'],
use: 'reply photo',
category: 'owner',
async: async (m, { func, mecha, setting, quoted }) => {
if (!/image/.test(quoted.mime)) return m.reply('Image not found.')
let media = await mecha.downloadAndSaveMediaMessage(m)
if (!media) return mecha.reply(m.chat, global.mess.wrong, m)
let data = await func.telegraPh(media)
if (!data.status) return m.reply(func.jsonFormat(data.msg))
setting.cover = data.url
mecha.reply(m.chat, func.texted('bold', 'Cover successfully set.'), m)
},
owner: true
}