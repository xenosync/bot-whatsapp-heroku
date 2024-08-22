const axios = require('axios');

exports.run = {
  usage: ['prodia2'],
  use: 'params',
  category: 'ai',
  async: async (m, { func, mecha }) => {
    if (!m.text) return m.reply(func.example(m.cmd, 'A vibrant and colorful anime scene of a young girl with long flowing hair standing in a blooming cherry blossom garden, wearing a traditional kimono, with a serene smile and large expressive eyes. The background features a clear blue sky and falling cherry blossoms, all in high definition.'));
    mecha.sendReact(m.chat, '🕒', m.key);
    
    try {
      const result = await prodia(m.text);
      
      if (!result.status) return m.reply(result.message);

      let request = result.params.request;
      let txt = '*P R O D I A*\n';
      for (let key in request) txt += `\n◦ ${func.ucword(key.replace(/_/g, '\t'))} : ${request[key]}`;

      mecha.sendMedia(m.chat, result.imageUrl, m, {
        caption: txt,
        expiration: m.expiration
      });
    } catch (error) {
      m.reply(`Terjadi kesalahan: ${error.message}`);
    }
  },
  premium: true
};

/*
SCRAPER INI MILIK SANZY 
DONT CLAIM AND DONT HAPUS WM

THANK TO:
 * SANZY
 * AMIRUL DEV
 * DLL

SOURCE: https://whatsapp.com/channel/0029Vai8oxEGE56lX2JMya3Q
*/

async function prodia(text) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('https://api.prodia.com/generate', {
        params: {
          new: true,
          prompt: text,
          model: 'absolutereality_v181.safetensors [3d9d4d2b]',
          negative_prompt: '',
          steps: 20,
          cfg: 7,
          seed: 1736383137,
          sampler: 'DPM++ 2M Karras',
          aspect_ratio: 'square'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://app.prodia.com/'
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const jobId = data.job;
        const imageUrl = `https://images.prodia.xyz/${jobId}.png`;

        resolve({
          status: true,
          imageUrl,
          ...data
        });
      } else {
        resolve({
          status: false,
          message: 'Permintaan tidak dapat diproses'
        });
      }
    } catch (error) {
      resolve({
        status: false,
        message: String(error)
      });
    }
  });
}