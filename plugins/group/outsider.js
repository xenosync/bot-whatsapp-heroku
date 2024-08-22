exports.run = {
usage: ['outsider'],
use: '(options)',
category: 'admin tools',
async: async (m, { func, mecha, errorMessage }) => {
try {
let member = m.members.filter(v => v.admin == null).map(v => v.id).filter(v => !v.startsWith('62') && v != m.bot)
if (!m.args || !m.args[0]) {
if (member.length == 0) return m.reply('Group ini bersih dari orang luar.')
let txt = `*${member.length}* orang luar ditemukan, kirim *${m.cmd} -y* untuk menghapusnya.\n\n`
txt += member.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n')
mecha.reply(m.chat, txt, m)
} else if (m.args[0] == '-y') {
for (let jid of member) {
await func.delay(2000)
await mecha.groupParticipantsUpdate(m.chat, [jid], 'remove')
}
await mecha.reply(m.chat, `Done, ${member.length} outsiders successfully removed.`, m)
}
} catch (e) {
return errorMessage(e)
}
},
admin: true,
group: true,
botAdmin: true
}