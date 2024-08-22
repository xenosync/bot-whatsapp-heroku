exports.run = {
usage: ['polling'],
hidden: ['poll'],
use: 'name text1 text2',
category: 'group',
async: async (m, { func, mecha }) => {
let args = m.text.split('\n').map(a => a.trim())
let name = args[0]
let values = args.slice(1)
if (!name) return m.reply(`Contoh: ${m.cmd} nama\nvalue\n\nContoh: ${m.cmd} *JUDUL*\nText1\nText2`)
if (values.length < 2) return m.reply('Harap berikan setidaknya dua nilai untuk jejak pendapat')
let poll = {
name: name,
values: values,
selectableCount: true
}
await mecha.sendMessage(m.chat, {poll: poll})
.then(msg => mecha.reply(m.chat, `Poll *${name}* telah dibuat, dengan opsi: *${values.join(', ')}*`, msg))
},
group: true,
admin: true
}