exports.run = {
usage: ['deskgc'],
hidden: ['rulesgc', 'descgc'],
category: 'group',
async: async (m, { mecha }) => {
mecha.reply(m.chat, `${m.metadata.desc}`, m)
},
group: true,
admin: true
}