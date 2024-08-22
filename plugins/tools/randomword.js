const axios = require('axios');
const translate = require('translate-google-api');

async function getRandomWord() {
  const options = {
    method: 'GET',
    url: 'https://random-word-by-api-ninjas.p.rapidapi.com/v1/randomword',
    headers: {
      'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
      'x-rapidapi-host': 'random-word-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const word = response.data.word[0];

    // Terjemahkan kata ke bahasa Indonesia
    const translatedWord = await translate(word, { to: 'id' });
    return translatedWord[0];
  } catch (error) {
    console.error(error);
    return { error: 'Gagal mendapatkan kata acak' };
  }
}

exports.run = {
  usage: ['randomword'],
  hidden: ['rword'],
  use: '',
  category: 'tools',
  async: async (m, { func, mecha }) => {
    const result = await getRandomWord();
    if (result.error) {
      m.reply(result.error);
    } else {
      m.reply(`${result}`);
    }
  },
  limit: true
};