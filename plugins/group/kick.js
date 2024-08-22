const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.run = {
  usage: ['kick'],
  hidden: ['tendang'],
  use: 'mention or reply',
  category: 'group',
  async: async (m, { func, mecha, setting }) => {
    try {
      if (!m.text && !m.quoted) return m.reply('Mention or Reply chat target.');
      let number = isNaN(m.text) ? (m.text.startsWith('+') ? m.text.replace(/[()+\s-]/g, '') : m.text.split('@')[1]) : m.quoted ? m.quoted.sender.split('@')[0] : m.text;
      if (isNaN(number)) return m.reply('Invalid number.');
      if (number.length > 15) return m.reply('Invalid format.');
      let target = number + '@s.whatsapp.net';
      if ([global.owner, m.bot, ...setting.owner].includes(target)) return m.reply('Access denied.');
      let cek = await mecha.onWhatsApp(target);
      if (cek.length == 0) return m.reply('Masukkan nomor yang valid dan terdaftar di WhatsApp!');
      let groups = await mecha.groupFetchAllParticipating();
      let groupIds = Object.keys(groups);
      let batch = [];
      for (let groupId of groupIds) {
        let group = groups[groupId];
        if (group.participants.some(participant => participant.id === m.bot && participant.admin)) {
          batch.push(groupId);
        }
      }
      for (let i = 0; i < batch.length; i++) {
        try {
          await mecha.groupParticipantsUpdate(batch[i], [target], 'remove');
          await sleep(2000);
        } catch (err) {
          m.reply(func.jsonFormat(err));
        }
      }
    } catch (err) {
      m.reply(func.jsonFormat(err));
    }
  },
  main: async (m, { func, mecha }) => {
    try {
      if (m.isGc && (m.mtype == 'reactionMessage') && m.message.reactionMessage.text === '🦶🏻' && m.isBotAdmin && m.isAdmin) {
        let key = m.msg.key;
        if ([global.owner, m.bot].includes(key.participant)) return;
        let groups = await mecha.groupFetchAllParticipating();
        let groupIds = Object.keys(groups);
        let batch = [];
        for (let groupId of groupIds) {
          let group = groups[groupId];
          if (group.participants.some(participant => participant.id === m.bot && participant.admin)) {
            batch.push(groupId);
          }
        }
        for (let i = 0; i < batch.length; i++) {
          try {
            await mecha.groupParticipantsUpdate(batch[i], [key.participant], 'remove');
            await sleep(2000);
          } catch (err) {
            m.reply(func.jsonFormat(err));
          }
        }
      }
    } catch (err) {
      m.reply(func.jsonFormat(err));
    }
  },
  group: true,
  admin: true,
  botAdmin: true
}