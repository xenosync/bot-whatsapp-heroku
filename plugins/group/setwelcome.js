exports.run = {
usage: ['setwelcome'],
use: 'text',
category: 'admin tools',
async: async (m, { func, mecha, groups }) => {
if (!m.text) return m.reply(func.example(m.cmd, `${global.tekswelcome}\n\n+user untuk tag user\n+group untuk nama grup\n+desc untuk deskripsi grup`))
let meta = await (await mecha.groupMetadata(m.chat)) || {};
let groupName = meta.subject || '';
let groupDesc = meta.desc || '';
let text = (m.text.replace('+user', `@${m.sender.split('@')[0]}`).replace('+group', groupName).replace('+desc', groupDesc))
groups.tekswelcome = m.text;
m.reply(`Text welcome successfully changed to :\n${text}`)
},
admin: true,
group: true
}