const axios = require('axios');

async function getRandomPassword() {
  const options = {
    method: 'GET',
    url: 'https://password-generator-by-api-ninjas.p.rapidapi.com/v1/passwordgenerator',
    headers: {
      'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
      'x-rapidapi-host': 'password-generator-by-api-ninjas.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: 'Gagal menghasilkan password' };
  }
}

async function processPasswordRequest(m, { func, mecha }) {
  const result = await getRandomPassword();
  if (result.error) {
    await mecha.reply(m.chat, result.error, m);
  } else {
    await mecha.reply(m.chat, `${result.random_password}`, m);
  }
}

exports.run = {
  usage: ['randompassword'],
  hidden: ['randompass'],
  category: 'tools',
  async: async (m, { func, mecha }) => {
    console.time("processPasswordRequest");
    await processPasswordRequest(m, { func, mecha });
    console.timeEnd("processPasswordRequest");
  },
  limit: true
};