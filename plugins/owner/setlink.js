exports.run = {
usage: ['setlink'],
use: 'text',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (m.quoted || m.text) {
let link = m.quoted ? m.quoted.text : m.text
if (!func.isUrl(link)) return m.reply(global.mess.error.url)
if (setting.link == link) return m.reply('Link already this.')
setting.link = link;
m.reply('Link successfully set.');
} else m.reply(func.example(m.cmd, 'https://chat.whatsapp.com/xxx'))
},
owner: true
}