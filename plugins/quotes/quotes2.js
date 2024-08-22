const axios = require('axios');
const translate = require('translate-google-api');

async function getRandomQuote() {
  const options = {
    method: 'GET',
    url: 'https://quotes-by-api-ninjas.p.rapidapi.com/v1/quotes',
    headers: {
      'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
      'x-rapidapi-host': 'quotes-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data[0]; // Mengambil kutipan pertama dari respons
  } catch (error) {
    console.error(error);
    return { error: 'Gagal mendapatkan kutipan' };
  }
}

exports.run = {
  usage: ['quotes'],
  hidden: ['qs2'],
  use: '',
  category: 'quotes',
  async: async (m, { func, mecha }) => {
    const result = await getRandomQuote();

    if (result.error) {
      m.reply(result.error);
    } else {
      const { quote, author, category } = result;
      
      try {
        // Terjemahkan kutipan ke bahasa Indonesia
        const translatedQuote = await translate(quote, { to: 'id' });
        
        // Kirim kutipan yang sudah diterjemahkan
        m.reply(`\"${translatedQuote[0]}\"\n\n— ${author}`);
      } catch (error) {
        m.reply('Gagal menerjemahkan kutipan.');
      }
    }
  },
  limit: true
};