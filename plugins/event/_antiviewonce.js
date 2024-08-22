exports.run = {
main: async (m, { func, mecha, groups }) => {
if (groups.antiviewonce && m.msg && m.msg.viewOnce && !m.fromMe) {
let caption = `乂  *ANTI VIEWONCE*\n\n◦  From: ${m.pushname}${m.budy ? '\n◦  Caption: ' + m.budy : ''}`
let buffer = await mecha.downloadMediaMessage(m.msg)
if (/image/.test(m.mtype)) {
await mecha.sendMessage(m.chat, {image: buffer, caption: caption, mentions: mecha.ments(caption)}, {quoted: m, ephemeralExpiration: m.expiration})
} else if (/video/.test(m.mtype)) {
await mecha.sendMessage(m.chat, {video: buffer, caption: caption, mimetype: 'video/mp4', mentions: mecha.ments(caption)}, {quoted: m, ephemeralExpiration: m.expiration})
}
}
},
group: true
}