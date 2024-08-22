const toMs = require('ms')

exports.run = {
usage: ['addsewa'],
use: 'link group + waktu',
category: 'owner',
async: async (m, { func, mecha, errorMessage }) => {
if (m.isPc){
let [url, time] = m.args;
if (!(url && time)) return m.reply(func.example(m.cmd, 'https://chat.whatsapp.com/codeInvite 15d'))
try {
let link = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
let [_, code] = url.match(link) || []
if (!code) return m.reply('No invite url detected.');
let data = await mecha.groupQueryInvite(code)
if (!data) return m.reply(`Maaf terjadi kesalahan:\n${String(data)}`)
const jid = data.id;
if (!mecha.isgroup(jid)) await mecha.groupAcceptInvite(code);
let groups = global.db.groups[jid];
let duration = time ? Date.now() + toMs(time) : '30d';
if (typeof groups !== 'undefined' && groups.sewa.status) return m.reply('Grup tersebut sudah ada di list sewa!')
if (!groups) {
global.db.groups[jid] = {
jid: jid,
name: data.subject,
sewa: {
status: true,
notice: true,
expired: duration
}
}
} else {
groups.sewa.status = true;
groups.sewa.notice = true;
groups.sewa.expired = duration;
}
m.reply(`Successfully added rent to this group for ${time}`)
if (mecha.isgroup(jid)) await func.delay(5000).then(() => mecha.sendMessage(jid, {text: `Successfully rent bot to group "${data.subject}" for ${time}`}, {quoted: func.fstatus('System Notification'), ephemeralExpiration: 86400}))
} catch (e) {
let error = String(e)
if (error.includes('not-authorized')) return m.reply('Masukkan bot kedalam grup tersebut terlebih dahulu.')
return m.reply(`Maaf terjadi kesalahan:\n${error}`)
}
} else if (m.isGc){
if (!m.text) return m.reply(`Masukkan durasi sewa!\nContoh: ${m.prefix + m.command} 15d`)
let groups = global.db.groups[m.chat];
if (groups && groups.sewa.status) return m.reply('Grup ini sudah ada di list sewa!')
groups.sewa.expired = m.args[0] ? Date.now() + toMs(m.args[0]) : '30d';
groups.sewa.status = true;
groups.sewa.notice = true;
m.reply(`Successfully added rent to this group for ${m.args[0]}`)
}
},
devs: true
}