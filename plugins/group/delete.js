exports.run = {
   usage: ['delete'],
   hidden: ['del', 'd'],
   use: 'reply chat',
   category: 'group',
   async: async (m, { mecha, isPrem }) => {
      if (m.isGc) {
         if (!m.quoted || (!m.quoted.fromMe && !m.isBotAdmin) || (!m.isAdmin && !isPrem && !m.isOwner)) 
            return m.reply(global.mess.admin);
         await mecha.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: m.quoted.id, fromMe: m.quoted.fromMe, participant: m.quoted.sender }});
         await mecha.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
      } else if (m.isPc && m.quoted?.fromMe && (isPrem || m.isOwner)) {
         await mecha.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: m.quoted.id, fromMe: m.quoted.fromMe, participant: m.quoted.sender }});
         await mecha.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
      }
   },
   main: async (m, { func, mecha, isPrem }) => {
      if (m.mtype === 'reactionMessage' && func.somematch(['🚫'], m.message.reactionMessage.text) && (m.isAdmin || isPrem || m.isOwner)) {
         let key = m.msg.key;
         await mecha.sendMessage(key.remoteJid, { delete: { remoteJid: m.chat, id: key.id, fromMe: key.fromMe, participant: key.participant }});
      }
   }
}
