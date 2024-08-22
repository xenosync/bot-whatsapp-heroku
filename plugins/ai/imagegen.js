const axios = require('axios');

exports.run = {
  usage: ['imagegen'],
  hidden: [],
  use: 'promptnya',
  category: 'ai',
  async: async (m, { func, mecha, quoted }) => {
    let prompt;
    if (m.args.length > 0) {
      prompt = m.args.join(" ");
    } else if (m.quoted && m.quoted.text) {
      prompt = m.quoted.text;
    } else {
      return m.reply(func.example(m.cmd, 'Generate a beautiful sunset'));
    }

    mecha.sendReact(m.chat, '🕒', m.key);

    try {
      const response = await generateImage(prompt);
      if (!response || !response.url) {
        return m.reply("No images generated.");
      }
      const result = {
        prompt: prompt,
        imageUrl: response.url
      };
      await m.reply(JSON.stringify(result, null, 2));
      mecha.sendReact(m.chat, '✅', m.key);
    } catch (error) {
      return m.reply(String(error));
    }
  },
  premium: true
};

async function generateImage(prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://aintellect.p.rapidapi.com/v1/generate',
        headers: {
          'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
          'x-rapidapi-host': 'aintellect.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          prompt: prompt
        }
      };

      const response = await axios.request(options);
      resolve(response.data);
    } catch (e) {
      reject(e);
    }
  });
}