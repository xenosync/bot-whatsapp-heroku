const axios = require('axios');
const crypto = require('crypto');

exports.run = {
  usage: ['news'],
  hidden: [''],
  use: 'text',
  category: 'ai',
  async: async (m, { func, mecha, users }) => {
    if (!m.text) return m.reply(func.example(m.cmd, 'apa itu coding'));
    try {
      let wait = await mecha.sendMessage(m.chat, { text: global.mess.wait }, { quoted: m, ephemeralExpiration: m.expiration });
      let response = await ainews(m.text);
      await mecha.sendMessage(m.chat, { text: JSON.stringify(response), edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
    } catch (e) {
      await mecha.sendMessage(m.chat, { text: `Terjadi kesalahan: ${JSON.stringify(e)}`, edit: wait.key }, { quoted: m, ephemeralExpiration: m.expiration });
    }
  },
  limit: 3
};

function generateUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16));
}

async function ainews(question) {
  try {
    const conversation_uuid = generateUUIDv4();
    const requestData = {
      chat_id: conversation_uuid,
      question,
      storage_path: '/var/www/hai.news/storage/app/public/',
      temperature: 0.8,
      tokens: 10000000,
      language: 'en'
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Android 12; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0',
        'Referer': 'https://hai.news/news/9ea5fef5-bbea-4e13-a3d8-3998bb58d344'
      }
    };

    const response = await axios.post('https://api.hai.news/question', requestData, config);
    if (!response.data) throw new Error('Tidak ada data yang diterima dari server.');
    return response.data;
  } catch (error) {
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
}