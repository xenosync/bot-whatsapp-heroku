exports.run = {
usage: ['listbadword'],
category: 'special',
async: async (m, { mecha, setting }) => {
if (setting.toxic.length == 0) return m.reply('Empty data.')
let txt = `乂  *LIST BAD WORD*\n\nTotal : ${setting.toxic.length}\n`
txt += setting.toxic.map((v, i) => `${i + 1}. ${v}`).join('\n')
mecha.reply(m.chat, txt, m)
}
}