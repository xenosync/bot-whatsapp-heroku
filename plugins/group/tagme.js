exports.run = {
usage: ['tagme'],
category: 'group',
async: async (m, { func, mecha, fkon }) => {
mecha.reply(m.chat, `@${m.sender.split('@')[0]}`, fkon)
},
group: true
}