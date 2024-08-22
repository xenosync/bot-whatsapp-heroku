const cheerio = require('cheerio');
const axios = require('axios');

async function ttSearch(query) {
  return new Promise(async (resolve, reject) => {
    axios("https://tikwm.com/api/feed/search", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "current_language=en",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: {
        keywords: query,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
      method: "POST",
    }).then((res) => {
      resolve(res.data.data);
    });
  });
}

async function random_mail() {
  const link = "https://dropmail.me/api/graphql/web-test-wgq6m5i?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D";
  try {
    let response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    let email = data["data"]["introduceSession"]["addresses"][0]["address"];
    let id_ = data["data"]["introduceSession"]["id"];
    let time = data["data"]["introduceSession"]["expiresAt"];

    return [email, id_, time];
  } catch (error) {
    console.log(error);
  }
}

function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 50,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee];

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}

exports.run = {
  usage: ['tiktoksearch'],
  hidden: ['ttsearch'],
  use: 'text',
  category: 'downloader',
  async: async (m, { func, mecha }) => {
    try {
      mecha.ttsearch = mecha.ttsearch ? mecha.ttsearch : {};
      if (!m.text) return m.reply(func.example(m.cmd, 'jedag jedug'));

      // Start timing
      const startTime = performance.now();

      mecha.sendReact(m.chat, '🕒', m.key);
      if (m.text.includes('https://tikwm.com/')) {
        await mecha.sendMedia(m.chat, m.text, m, {
          caption: global.mess.ok,
          expiration: m.expiration
        });
      } else {
        let result = await (await ttSearch(m.text)).videos;
        let cover = 'https://tikwm.com' + result[0].cover;
        let title = '```Result from:```' + '\t`' + m.text + '`';
        let body = `Total result: ${result.length}`;
        let rows = [];
        for (let i of result) {
          rows.push({
            headers: 'Download Video',
            title: i.title,
            description: `Region: ${i.region}`,
            id: `${m.prefix}ttsearch https://tikwm.com${i.play}`,
          });
        }
        let sections = [{
          title: 'T I K T O K - S E A R C H',
          highlight_label: 'Populer Video',
          rows: rows
        }];
        let button = [
          ['list', 'Click Here ⎙', sections],
        ];
        mecha.sendButton(m.chat, title, body, footer, button, m, {
          media: cover,
          expiration: m.expiration
        });

        // End timing
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(3);
        const caption = `*Waktu Proses*: ${duration} Detik`;

        // Send media with processing time information
        await mecha.sendMedia(m.chat, cover, m, {
          caption: caption,
          expiration: m.expiration
        });

        mecha.ttsearch[m.sender] = result;
      }
    } catch (error) {
      console.log(error);
      mecha.reply(m.chat, 'Terjadi kesalahan dalam menjalankan perintah', m);
    }
  },
  premium: true
};