exports.run = {
  main: async (m, { func, mecha, groups, errorMessage }) => {
    try {
      const messageBody = typeof m.body === 'string' ? m.body : '';
      const isWhatsAppLink = messageBody.match(/(?:https?:\/\/)?(?:chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com|wa\.link|whatsapp\.com\/channel)\/[^\s]+/gi);
      const hasOtherLinks = messageBody.match(/https?:\/\/[^\s]+/gi);
      const hasLinkPreview = m.message && m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo && m.message.extendedTextMessage.contextInfo.quotedMessage && m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
      console.log('WhatsApp links detected:', isWhatsAppLink);
      console.log('Other links detected:', hasOtherLinks);
      console.log('Link preview detected:', hasLinkPreview);
      if (hasOtherLinks && !isWhatsAppLink && groups.antilink && !m.isAdmin && !m.isOwner && !hasLinkPreview) {
        await mecha.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
          }
        });
      }
    } catch (e) {
      console.error('Error detected:', e);
      const botID = mecha.user.jid;
      await mecha.sendMessage(botID, {
        text: `Error detected: ${e.message}`
      });
      return errorMessage(e);
    }
  },
  group: true,
  botAdmin: true
};