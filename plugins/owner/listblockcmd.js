exports.run = {
usage: ['listblockcmd'],
hidden: ['listblokcmd'],
category: 'owner',
async: async (m, { func, mecha, setting }) => {
if (setting.blockcmd.length == 0) return m.reply('Empty data.')
let txt = '乂  *LIST BLOCK COMMANDS*\n\n'
txt += `Total: *${setting.blockcmd.length}* commands blocked\n\n`
txt += setting.blockcmd.map((v) => `◦  ${m.prefix + v}`).join('\n')
m.reply(txt)
}
}