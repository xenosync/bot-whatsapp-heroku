exports.run = {
usage: ['typefile'],
use: 'audio / document',
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (m.args[0] === 'audio'){
setting.typefile = 'audio'
m.reply('Successfully changed typefile to audio')
} else if (m.args[0] === 'document'){
setting.typefile = 'document'
m.reply('Successfully changed typefile to document')
} else m.reply(func.example(m.cmd, 'audio / document'))
},
owner: true
}