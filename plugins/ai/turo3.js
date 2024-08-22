const axios = require('axios');
const chatMemory = {};

exports.run = {
  usage: [],
  hidden: ['turo3'],
  use: 'question',
  category: 'ai',
  async: async (m, { func, mecha }) => {
    if (!m.text) {
      return m.reply(func.example(m.cmd, 'Apa itu Turo3?'));
    }
    
    mecha.sendReact(m.chat, '🕒', m.key); // Menunjukkan bahwa proses sedang berlangsung

    // Mendapatkan tanggal saat ini
    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Mengelola memori percakapan
    if (!chatMemory[m.chat]) {
      chatMemory[m.chat] = [];
    }
    chatMemory[m.chat].push({ role: "user", content: m.text });

    if (chatMemory[m.chat].length > 3) {
      chatMemory[m.chat].shift();
    }

    try {
      // Mengirim permintaan ke API Turo3
      const options = {
        method: 'POST',
        url: 'https://turo3.p.rapidapi.com/turo',
        headers: {
          'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
          'x-rapidapi-host': 'turo3.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          query: m.text
        }
      };

      const response = await axios.request(options);
      const turoResponse = response.data.content;

      // Menyimpan balasan dari API dalam memori percakapan
      chatMemory[m.chat].push({ role: "assistant", content: turoResponse });

      // Mengirim balasan kepada pengguna
      mecha.reply(m.chat, turoResponse, m, {
        expiration: m.expiration
      });

    } catch (error) {
      console.error(error);
      return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
    }
  },
  limit: true
};