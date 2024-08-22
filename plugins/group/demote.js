exports.run = {
usage: ['demote'],
hidden: ['dm'],
use: 'mention or reply',
category: 'group',
async: async (m, { func, mecha, setting }) => {
if (!m.text && !m.quoted) return m.reply('Mention or Reply chat target.')
let number = isNaN(m.text) ? (m.text.startsWith('+') ? m.text.replace(/[()+\s-]/g, '') : m.text.split('@')[1]) : m.quoted ? m.quoted.sender.split('@')[0] : m.text
if (isNaN(number)) return m.reply('Invalid number.')
if (number.length > 15) return m.reply('Invalid format.')
let target = number + '@s.whatsapp.net'
if ([global.owner, m.bot, ...setting.owner].includes(target)) return m.reply('Access denied.')
let cek = await mecha.onWhatsApp(target)
if (cek.length == 0) return m.reply(`Masukkan nomor yang valid dan terdaftar di WhatsApp!`)
mecha.groupParticipantsUpdate(m.chat, [target], 'demote').then(res => {
mecha.sendMessage(m.chat, {text: `Sukses menjadikan @${target.split('@')[0]} sebagai member biasa`, mentions: [target]}, {quoted: m})
}).catch(() => m.reply(mess.error.api))
},
group: true,
admin: true,
botAdmin: true
}