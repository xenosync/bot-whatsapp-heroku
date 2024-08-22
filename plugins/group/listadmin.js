exports.run = {
usage: ['listadmin'],
hidden: ['adminlist'],
category: 'group',
async: async (m, { func, mecha }) => {
let groupsadmin = m.metadata.participants.filter(v => v.admin)
let listadmin = groupsadmin.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
let txt = '乂  *L I S T - A D M I N*\n\n'
txt += `Total : ${groupsadmin.length}`
txt += `\n${listadmin}`
m.reply(txt)
},
group: true
}