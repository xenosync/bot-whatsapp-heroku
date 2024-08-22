const axios = require('axios');

const chatMemory = {};
const apiKey = 'oki27';
const apiUrl = 'https://api.yanzbotz.my.id/api/ai/gpt4';

exports.run = {
  usage: [],
  hidden: ['gpty'],
  use: 'question',
  category: 'ai',
  async: async (m, { func, mecha }) => {
    if (!m.text) {
      return m.reply(func.example(m.cmd, 'Berikan pertanyaan untuk diajukan kepada GPT-4'));
    }
    
    mecha.sendReact(m.chat, '🕒', m.key);
    
    if (!chatMemory[m.chat]) {
      chatMemory[m.chat] = [];
    }
    
    chatMemory[m.chat].push({ role: 'user', content: m.text });

    const now = new Date();
    const jakartaOffset = 7 * 60 * 60 * 1000;
    const jakartaTime = new Date(now.getTime() + jakartaOffset);
    
    const year = jakartaTime.getFullYear();
    const month = String(jakartaTime.getMonth() + 1).padStart(2, '0');
    const day = String(jakartaTime.getDate()).padStart(2, '0');
    const hours = String(jakartaTime.getHours()).padStart(2, '0');
    const minutes = String(jakartaTime.getMinutes()).padStart(2, '0');
    const seconds = String(jakartaTime.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const systemPrompt = `Anda adalah asisten yang sangat ramah dan informatif. Tugas Anda adalah memberikan jawaban yang mendetail dan terstruktur berdasarkan pertanyaan yang diajukan. Jawaban Anda harus lengkap, mudah dibaca, dan memberikan penjelasan yang jelas. Gunakan informasi waktu dan tanggal saat ini hanya jika relevan untuk konteks jawaban: ${formattedDateTime} WIB.`;

    const options = {
      method: 'GET',
      url: apiUrl,
      params: {
        query: m.text,
        system: systemPrompt,
        apiKey: apiKey
      },
      headers: {
        'accept': 'application/json'
      }
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.status === 200) {
        const responseText = response.data.result ? response.data.result.trim() : 'No response text available';
        chatMemory[m.chat].push({ role: 'assistant', content: responseText });
        const finalResponse = responseText;
        mecha.reply(m.chat, finalResponse, m, {
          expiration: m.expiration
        });
      } else {
        mecha.reply(m.chat, 'Tidak ada respons dari GPT-4', m);
      }
    } catch (error) {
      console.error(error);
      return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
    }
  },
  limit: true
};