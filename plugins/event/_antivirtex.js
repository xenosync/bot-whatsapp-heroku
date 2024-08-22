exports.run = {
main: async (m, { func, mecha, groups }) => {
if (!m.fromMe && !m.isAdmin && !m.isOwner && m.budy && (groups.antivirtex && m.budy.match(/(৭৭৭৭৭৭৭৭|๒๒๒๒๒๒๒๒|๑๑๑๑๑๑๑๑|ดุท้่เึางืผิดุท้่เึางื)/gi) || groups.antivirtex && m.budy.length > 10000)) return mecha.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: m.sender
}
})
.then(() => mecha.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
.then(() => mecha.sendMessage(global.owner, {text: `Detected @${m.sender.split('@')[0]} (${m.pushname}) has sent virtex in group ${m.groupName}`, mentions: [m.sender]}, {quoted: func.fstatus('Notifikasi Keamanan Group'), ephemeralExpiration: m.expiration}))
},
botAdmin: true,
group: true
}