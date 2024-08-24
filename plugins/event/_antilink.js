exports.run = {
  main: async (m, { func, mecha, groups, errorMessage }) => {
    try {
      // remove link then kick when antilink is turned on
      if (m.budy && groups.antilink && !m.isAdmin && !m.isOwner) {
        if (m.budy.match(/(chat.whatsapp.com)/gi) && !m.budy.includes(await mecha.groupInviteCode(m.chat))) {
          return mecha.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat, 
              fromMe: false, 
              id: m.key.id, 
              participant: m.sender
            }
          })
          .then(() => mecha.sendMessage(m.chat, {text: `Sorry @${m.sender.split('@')[0]} you will be removed from this group.`, mentions: [m.sender]}, {quoted: func.fstatus('Anti Link Grup Lain'), ephemeralExpiration: m.expiration}))
          .then(() => mecha.groupParticipantsUpdate(m.chat, [m.sender], 'remove'));
        }
      }
      // Do nothing if antilink is off
    } catch (e) {
      return errorMessage(e);
    }
  },
  group: true,
  botAdmin: true
}
