exports.run = {
usage: ['setprefix'],
use: 'symbol',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (!m.text) return m.reply(func.example(m.cmd, '#'))
if (m.args[0] == 'multi') {
if (setting.multiprefix) return m.reply('Prefix is already this.')
setting.multiprefix = true;
m.reply(`Prefix successfully changed to multi`)
} else {
if (setting.prefix == m.args[0] && !setting.multiprefix) return m.reply('Prefix is already this.')
setting.multiprefix = false;
setting.prefix = m.args[0];
m.reply(`Prefix successfully changed to : ${m.args[0]}`)
}
},
owner: true
}