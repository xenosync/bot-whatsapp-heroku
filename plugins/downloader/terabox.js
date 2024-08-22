const axios = require('axios');

async function terabox(url) {
  try {
    const response = await axios.get(`https://tera.instavideosave.com/?url=${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    if (response.data.video && response.data.video.length > 0) {
      return {
        status: true,
        data: response.data.video[0]
      };
    } else {
      return {
        status: false,
        message: 'No video data found in the response'
      };
    }
  } catch (error) {
    console.error('Error fetching data from terabox:', error);
    return {
      status: false,
      message: 'Error fetching data from terabox',
      error: error.message || 'Unknown Error',
      stack: error.stack || 'No stack trace available',
      statusCode: error.response ? error.response.status : 'N/A',
      headers: error.response ? JSON.stringify(error.response.headers) : 'N/A'
    };
  }
}

exports.run = {
  usage: ['terabox'],
  hidden: ['teraboxdl'],
  use: 'link terabox',
  category: 'downloader',
  async: async (m, { func, mecha, command }) => {
    if (!m || !m.text) {
      return m.reply(func.example(command, 'link'));
    }

    try {
      m.reply(global.mess.wait);

      const result = await terabox(m.text);

      if (result.status) {
        const { video, thumbnail } = result.data;

        if (thumbnail) {
          await mecha.sendMessage(m.chat, { image: { url: thumbnail } }, { quoted: m });
        }

        if (video) {
          await mecha.sendMessage(m.chat, {
            video: { url: video },
            caption: 'Here is your video'
          }, { quoted: m });
        }

        await mecha.sendReact(m.chat, '✅', m.key);
      } else {
        const errorMessage = `Internal Error: ${result.message}\n\n` +
                             `Error Details: ${result.error}\n` +
                             `Status Code: ${result.statusCode}\n` +
                             `Headers: ${result.headers}\n` +
                             `Stack Trace: ${result.stack}`;
        m.reply(errorMessage);
      }
    } catch (e) {
      console.error('Error:', e);
      const errorMessage = `Internal Error: ${e.message || 'Unknown Error'}\n\n` +
                           `Full Error: ${JSON.stringify(e, null, 2)}`;
      m.reply(errorMessage);
    }
  },
  premium: true,
  limit: 3
};