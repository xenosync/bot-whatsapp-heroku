exports.run = {
usage: ['kontak'],
use: 'number | nama',
category: 'owner',
async: async (m, { func, mecha }) => {
const [number, name] = m.text.split('|');
if (m.quoted) {
if (!m.text) return m.reply('Masukkan nama kontak tersebut!')
mecha.sendkontak(m.chat, m.quoted.sender, m.text, m)
} else if (m.text) {
if (!number) return m.reply(func.example(m.cmd, '62895415497664 | Surya'))
if (!name) return m.reply(func.example(m.prefix + m.command, '62895415497664 | Surya'))
let nomor = number.replace(/[^0-9]/g, '')
mecha.sendkontak(m.chat, nomor, name, m)
} else m.reply('Mention or Reply chat target.')
},
owner: true
}