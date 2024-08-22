const fs = require('fs'),
fetch = require('node-fetch');
moment = require('moment-timezone');

exports.run = {
usage: ['bcuser', 'bcprem', 'bcpc', 'bcgc', 'bcsewa'],
use: 'text',
category: 'owner',
async: async (m, { func, mecha, store, setting, quoted }) => {
switch (m.command) {
case 'bcuser':{
if (!m.text) return m.reply(func.example(m.cmd, 'minimal mandi'))
let data = Object.values(global.db.users).filter(v => v.register && !v.banned).map(v => v.jid)
await m.reply(`Sending broadcast to *${data.length}* users..`)
let old = new Date()
let txt = m.text.replace('@owner', `@${global.owner.split('@')[0]}`)
for (let jid of data) {
await func.delay(1500)
mecha.sendMessageModify(jid, txt, null, {
title: 'System Notification', 
body: global.header, 
thumbnail: await (await fetch(setting.cover)).buffer(),
expiration: 86400
})
}
m.reply(`Successfully sent broadcast to *${data.length}* users in *${Math.floor(((new Date - old) / 1000))}* seconds.`)
}
break
case 'bcprem':{
if (!m.text) return m.reply(func.example(m.prefix + m.command, 'minimal mandi'))
let data = Object.values(global.db.users).filter(v => v.register && v.premium && !v.banned).map(v => v.jid)
m.reply(`Sending broadcast to *${data.length}* premium users..`)
let txt = m.text.replace('@owner', `@${global.owner.split('@')[0]}`)
let old = new Date()
for (let jid of data) {
await func.delay(1500)
mecha.sendMessageModify(jid, txt, null, {
title: 'System Notification', 
body: global.header, 
thumbnail: await (await fetch(setting.cover)).buffer(),
expiration: 86400
})
}
m.reply(`Successfully sent broadcast to *${data.length}* premium users in *${Math.floor(((new Date - old) / 1000))}* seconds.`)
}
break
case 'bcpc':{
if (!m.text) return m.reply(func.example(m.prefix + m.command, 'minimal mandi'))
let data = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
let txt = m.text.replace('@owner', `@${global.owner.split('@')[0]}`)
m.reply(`Sending broadcast to *${data.length}* private chat..`)
let old = new Date()
for (let jid of data) {
await func.delay(1500)
mecha.sendMessageModify(jid, txt, null, {
title: 'System Notification', 
body: global.header, 
thumbnail: await (await fetch(setting.cover)).buffer(),
expiration: 86400
})
}
m.reply(`Successfully sent broadcast to *${data.length}* private chat in *${Math.floor(((new Date - old) / 1000))}* seconds.`)
}
break
case 'bcgc':{
let txt = m.text.replace('@owner', `@${global.owner.split('@')[0]}`)
let groups = Object.values(await mecha.groupFetchAllParticipating()).filter(v => v.participants.find(v => v.id == mecha.user.jid) && v.announce == false)
let data = groups.map(x => x.id)
let mentions = [];
groups.map(({ participants }) => participants.map(v => v.id)).map(jid => mentions.push(...jid))
if (/image\/(webp)/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMessage(jid, {sticker: media, mentions: mentions}, {quoted: null, ephemeralExpiration: 86400})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else if (/video|image\/(jpe?g|png)/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMedia(jid, media, null, {
caption: txt ? '乂  *B R O A D C A S T*\n\n' + txt : '',
mentions: mentions, 
expiration: 86400
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else if (/audio/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMedia(jid, media, null, {
ptt: quoted.ptt,
mentions: mentions, 
expiration: 86400
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else {
if (!m.text) return m.reply(func.example(m.prefix + m.command, 'minimal mandi'))
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
let messageId = 'MECHA' + func.makeid(8).toUpperCase() + 'GPT'
let thumb = await mecha.resize('https://telegra.ph/file/66ea637e36d49f218e4d1.jpg', 400, 400)
for (let jid of data) {
await func.delay(1500)
await mecha.sendMessageModify(jid, txt, null, {
title: 'B R O A D C A S T', 
body: global.header, 
thumbnail: await (await fetch('https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg')).buffer(),
largeThumb: true,
mentions: mentions, 
expiration: 86400,
messageId: messageId
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
}
}
break
case 'bcsewa':{
let groupList = Object.values(await mecha.groupFetchAllParticipating()).filter(v => v.participants.find(v => v.id == mecha.user.jid) && !v.announce)
let groups = groupList.map(x => x.id)
let data = Object.values(global.db.groups).filter(v => v.sewa.status).map(x => x.jid)
let txt = m.text.replace('@owner', `@${global.owner.split('@')[0]}`)
let mentions = [...mecha.ments(txt), ...Object.values(global.db.users).filter(v => !v.banned).map(v => v.jid)]
if (/image\/(webp)/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
if (!groups.includes(jid)) continue;
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMessage(jid, {sticker: media, mentions: mentions}, {quoted: null, ephemeralExpiration: 86400})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else if (/video|image\/(jpe?g|png)/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
if (!groups.includes(jid)) continue;
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMedia(jid, media, null, {
caption: txt ? '乂  *B R O A D C A S T*\n\n' + txt : '',
mentions: mentions, 
expiration: 86400
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else if (/audio/.test(quoted.mime)) {
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
if (!groups.includes(jid)) continue;
await func.delay(1500)
let media = await quoted.download()
await mecha.sendMedia(jid, media, null, {
ptt: quoted.ptt,
mentions: mentions, 
expiration: 86400
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
} else {
if (!m.text) return m.reply(func.example(m.prefix + m.command, 'minimal mandi'))
m.reply(`Sending broadcast to *${data.length}* group chat..`)
let old = new Date()
for (let jid of data) {
if (!groups.includes(jid)) continue;
await func.delay(1500)
await mecha.sendMessageModify(jid, txt, null, {
title: 'B R O A D C A S T', 
body: global.header, 
thumbnail: await (await fetch('https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg')).buffer(),
largeThumb: true,
mentions: mentions, 
expiration: 86400
})
}
mecha.reply(m.chat, `Successfully send broadcast message to *${data.length}* groups in *${Math.floor(((new Date - old) / 1000))}* seconds.`, m)
}
}
break
}
},
owner: true
}