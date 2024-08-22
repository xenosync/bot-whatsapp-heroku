exports.run = {
usage: ['unblock'],
use: 'mention or reply',
category: 'owner',
async: async (m, { mecha, froms }) => {
if (m.quoted || m.text) {
if (!froms) return m.reply('Invalid number.')
mecha.updateBlockStatus(froms, 'unblock')
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
} else m.reply(`Mention or Reply chat target.`)
},
owner: true
}