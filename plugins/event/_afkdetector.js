exports.run = {
main: async (m, { func, mecha, groups }) => {
let afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let jid of afk) {
let user = global.db.users[jid]
if (!user) continue
let afkTime = user.afk
if (!afkTime || afkTime < 0) continue
let reason = user.alasan || ''
if (!m.fromMe && !(m.mentionedJid?.length >= 10) && !groups.mute && m.command !== 'setalasan') {
mecha.reply(m.chat, `Jangan tag dia!\nDia sedang AFK ${reason ? 'dengan alasan ' + reason : ''}\nSelama *${func.clockString(new Date - afkTime)}*`, m, {
expiration: m.expiration
})
/*.then(async () => {
if (m.budy) await mecha.reply(jid, `Seseorang dari grup *${await (await mecha.groupMetadata(m.chat)).subject}*, menandai atau menyebut Anda.\n\nNama: @${m.sender.split('@')[0]}\nPesan: ${m.budy}`, m, {
expiration: m.expiration
})
})*/
}
}
},
group: true
}