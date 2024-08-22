const axios = require('axios');

exports.run = {
  usage: ['prompter'],
  use: 'reply photo',
  category: 'convert',
  async: async (m, { func, mecha, quoted }) => {
    if (/image/.test(quoted.mime)) {
      let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
      let media = await mecha.downloadAndSaveMediaMessage(quoted);
      let anu = await func.telegraPh(media);

      try {
        const prompterResult = await axios.get(`https://api.itsrose.rest/image/stable/prompter?url=${encodeURIComponent(anu.url)}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b'
          }
        });

        if (prompterResult.data.status) {
          const prompt = prompterResult.data.result.prompt;
          await mecha.sendMessage(m.chat, { text: prompt, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
        } else {
          await mecha.sendMessage(m.chat, { text: 'Tidak dapat memproses gambar.' }, { quoted: m, ephemeralExpiration: m.expiration });
        }
      } catch {
        await mecha.sendMessage(m.chat, { text: 'Terjadi kesalahan dalam proses.' }, { quoted: m, ephemeralExpiration: m.expiration });
      }
    } else {
      m.reply('Input media dengan benar!');
    }
  },
  limit: true
};