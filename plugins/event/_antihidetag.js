exports.run = {
main: async (m, { func, mecha, errorMessage }) => {
try {
if (!m.isOwner && !m.isAdmin && m.mentionedJid?.length >= m.members?.length) {
await mecha.sendMessage(m.chat, {text: `Sorry @${m.sender.split('@')[0]} you will be removed from this group.`, mentions: [m.sender]}, {quoted: func.fstatus('Hidetag Message Detected'), ephemeralExpiration: m.expiration})
.then(() => mecha.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
}
} catch (e) {
return errorMessage(e)
}
},
group: true,
botAdmin: true
}