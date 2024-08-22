exports.run = {
usage: ['listgroup'],
hidden: ['listgrup', 'listgc'],
category: 'owner',
async: async (m, { func, mecha }) => {
let data = Object.values(await mecha.groupFetchAllParticipating().catch(_=> []))
let txt = `乂  *L I S T - G R O U P*\n\nTerdapat Total *${data.length}* Group`
let rows = [];
if (data.length == 0) return m.reply('Data kosong.')
for (let [index, i] of data.entries()) {
rows.push({
title: `${index + 1}. ${i.subject}`,
description: `Peserta: ${i.participants ? Object.keys(i.participants).length : '0'}\nPembuat: ${i.owner ? (global.db.users[i.owner]?.name || await mecha.getName(i.owner)) : 'Sudah keluar'}`,
id: `${m.prefix}listgc ${i.id} detail`
})
}
const [jid, value] = m.args;
const groups = data.map(x => x.id);
if (jid && value && jid.endsWith('@g.us') && groups.includes(jid) && value === 'detail') {
let meta = await mecha.groupMetadata(jid).catch(e => {})
let isBotAdmins = func.findAdmin(meta.participants).includes(m.bot)
let txt = `◦  Nama Grup : ${meta.subject}`
txt += `\n◦  ID Group : ${meta.id}`
txt += `\n◦  Total Member : ${meta.size}`
txt += `\n◦  Edit Setelan Grup : ${meta.restrict ? 'hanya admin' : 'semua peserta'}`
txt += `\n◦  Kirim Pesan : ${meta.announce ? 'hanya admin' : 'semua peserta'}`
txt += `\n◦  Bot Admin : ${isBotAdmins ? 'Iya' : 'Tidak'}`
txt += `\n◦  Pesan Sementara : ${meta.ephemeralDuration ? 'Aktif' : 'Mati'}`
let sections = [{
title: 'Group Information', 
highlight_label: 'Populer Feature',
rows: [
{
title: 'Group Profile',
description: `Viewing group profile ${meta.subject}`, 
id: `${m.prefix}listgc ${jid} profile`
},
{
title: 'Group Description',
description: `Viewing group description ${meta.subject}`, 
id: `${m.prefix}listgc ${jid} desc`
},
{
title: 'Group Leave',
description: `Make the bot leave the group ${meta.subject}`, 
id: `${m.prefix}listgc ${jid} leave`
},
{
title: 'Group Admin',
description: `Viewing admin group ${meta.subject}`, 
id: `${m.prefix}listgc ${jid} admin`
},
{
title: 'Group Member',
description: `Viewing member group ${meta.subject}`, 
id: `${m.prefix}listgc ${jid} member`
},
...(isBotAdmins ? [{
title: 'Group Close',
description: `Close the group ${meta.subject}`, 
id: `${m.prefix}listgc ${m.args[0]} close`
},
{
title: 'Group Open',
description: `Open a group ${meta.subject}`, 
id: `${m.prefix}listgc ${m.args[0]} open`
},
{
title: 'Group Link',
description: `Viewing group link ${meta.subject}`, 
id: `${m.prefix}listgc ${m.args[0]} link`
},
{
title: 'Group Add Owner',
description: `Add owner to group ${meta.subject}`, 
id: `${m.prefix}listgc ${m.args[0]} add_owner`
}] : [])
],
},
]
let button = [
['list', 'Click Here ⎙', sections],
['copy', 'Copy Group ID', jid]
]
mecha.sendButton(m.chat, 'D E T A I L - G R O U P', txt, 'Select the list button below.', button, m, {
expiration: m.expiration
})
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'profile') {
let profile = await func.getBuffer(await mecha.profilePictureUrl(jid, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'))
mecha.sendMessage(m.chat, {image: profile}, {quoted: m, ephemeralExpiration: m.expiration})
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'desc') {
let meta = await mecha.groupMetadata(jid).catch(e => {})
mecha.reply(m.chat, meta.desc, m, {expiration: m.expiration})
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'link') {
let code = await mecha.groupInviteCode(jid).catch(_ => '')
if (!code) return m.reply(global.mess.botAdmin)
let meta = await mecha.groupMetadata(jid).catch(e => {})
m.reply(`Link Group ${meta.subject}\n\nhttps://chat.whatsapp.com/${code}`)
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'leave') {
mecha.reply(jid, 'Hai kak, Aku diperintahkan Owner untuk keluar dari group ini :)\nMohon maaf jika bot punya banyak kesalahan :)\nGood bye...', func.fstatus('System Notification'))
await mecha.groupLeave(jid)
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'close') {
mecha.reply(jid, 'Group ini di tutup oleh owner secara otomatis.', func.fstatus('System Notification'))
await mecha.groupSettingUpdate(jid, 'announcement')
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'open') {
mecha.reply(jid, 'Group ini di buka oleh owner secara otomatis.', func.fstatus('System Notification'))
await mecha.groupSettingUpdate(jid, 'not_announcement')
.then((res) => mecha.sendReact(m.chat, '✅', m.key))
.catch((e) => mecha.sendReact(m.chat, '❌', m.key))
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'admin') {
let meta = await mecha.groupMetadata(jid).catch(e => {})
m.reply(`*List Admin Group* ${meta.subject}\n\n${meta.participants.filter(p => p.admin).map((v, i) => (i + 1) + '. @' + v.id.split('@')[0]).join('\n')}`)
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'member') {
let meta = await mecha.groupMetadata(jid).catch(e => {})
m.reply(`*Detail Member Group* ${meta.subject}\n\n${meta.participants ? meta.participants.map((x, i) => (i + 1) + '. @' + x.id.split('@')[0] + ' (' + (x.admin == 'superadmin' ? 'Owner' : x.admin == 'admin' ? 'Admin' : 'Member') + ')').join('\n').trim() : 'Tidak ada'}`)
} else if (m.text && jid.endsWith('@g.us') && groups.includes(jid) && value === 'add_owner') {
await mecha.groupParticipantsUpdate(jid, [global.owner], 'add').then(data => {
for (let i of data) {
if (i.status == 403){
m.reply('Diprivate oleh yang bersangkutan.')
} else if (i.status == 409){
m.reply('Orang yang anda add sudah berada didalam grup.')
} else if (i.status == 408){
m.reply('Dia baru keluar grup baru baru ini.')
} else if (i.status == 401){
m.reply('Bot di block oleh yang bersangkutan.')
} else m.reply('Sukses menambahkan owner.')
}
})
} else {
let sections = [{
title: 'L I S T - G R O U P', 
highlight_label: 'Populer Groups',
rows: rows
}]
let button = [
['list', 'Click Here ⎙', sections],
]
mecha.sendButton(m.chat, `L I S T - G R O U P`, `Total Group : ${data.length}`, 'Select the list button below.', button, m, {
expiration: m.expiration
})
}
},
owner: true
}