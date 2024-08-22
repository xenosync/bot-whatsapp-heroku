const moment = require('moment-timezone');

exports.run = {
usage: ['approve'],
hidden: ['accept', 'acc'],
category: 'group',
async: async (m, { func, mecha }) => {
let database = [];
let txt = `乂  *LIST REQUEST JOIN*\n`
txt += `\n*${m.prefix}acc 1* untuk approve peserta 1`
txt += `\n*${m.prefix}acc all* untuk approve semua peserta`
const data = await mecha.groupRequestParticipantsList(m.chat)
if (data.length == 0) return m.reply('Tidak ada pending request.')
data.forEach((v, index) => {
database.push({ index: index + 1, jid: v.jid, request_method: v.request_method, request_time: v.request_time })
txt += `\n\n${index + 1}. @${v.jid.split('@')[0]}`
txt += `\n◦  *Request method:* ${v.request_method}`
txt += `\n◦  *Time:* ${moment(Date.now() - v.request_time).tz('Asia/Jakarta').format('DD/MM/YY HH:mm:ss')}`
})
if (m.text && m.text.toLowerCase() === 'all') {
for (let i of data) {
await mecha.groupRequestParticipantsUpdate(m.chat, [i.jid], 'approve')
func.delay(1000)
}
mecha.reply(m.chat, `Successfully approved ${data.length} participants.`, m)
} else if (m.text && database.some(v => v.index == m.text)) {
let user = database[m.text - 1].jid;
await mecha.groupRequestParticipantsUpdate(m.chat, [user], 'approve')
mecha.sendReact(m.chat, '✅', m.key)
} else await mecha.reply(m.chat, txt, m)
},
group: true,
admin: true,
botAdmin: true
}