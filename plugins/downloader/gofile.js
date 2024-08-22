let database = {};

async function gofile(url) {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate URL
      if (!/gofile.io\/d\//gi.test(url)) return reject("Invalid URL!");

      // Extract folder ID from URL
      const match = /https:\/\/gofile.io\/d\/([\d\w]+)/gi.exec(url);
      if (!match) return reject("Folder Id Not Found");
      const id = match[1];

      const BASE_API = "https://api.gofile.io";
      const BASE_URL = "https://gofile.io";

      // Create account
      const accResponse = await fetch(BASE_API + "/accounts", {
        method: "POST",
        headers: {
          origin: BASE_URL,
          referer: `${BASE_URL}/`,
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const acc = await accResponse.json();

      if (acc.status !== "ok") return reject("Error making account");
      const { token } = acc.data;

      // Fetch content
      const contentResponse = await fetch(`${BASE_API}/contents/${id}?wt=${token}`, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        },
      });
      const content = await contentResponse.json();

      if (content.status !== "ok") return reject("Error fetching content");

      resolve(content.data);
    } catch (error) {
      reject(error.message);
    }
  });
}

exports.run = {
    usage: ['gofile'],
    hidden: ['gofile'],
    use: 'url',
    category: 'convert',
    async: async (m, { func, mecha }) => {
        if (m.text) {
            let url = m.text.trim();
            if (!url) return m.reply('Masukkan URL Gofile yang ingin diambil kontennya.');
            if (!/^https?:\/\//.test(url)) {
                url = 'http://' + url;
            }
            mecha.sendReact(m.chat, '🕒', m.key);
            try {
                const res = await gofile(url);
                m.reply(JSON.stringify(res, null, 2));
            } catch (err) {
                m.reply(`Maaf, gagal mengambil konten dari URL Gofile: ${err}`);
            }
            return true;
        }
        let jid = m.sender;
        database[jid] = Date.now();
        m.reply('Kirim URL Gofile yang ingin diambil kontennya...');
        return true;
    },
    main: async (m, { func, mecha }) => {
        let jid = m.sender;
        if (jid in database && (Date.now() - database[jid]) < 3600000) {
            let url = m.budy.trim();
            if (!/^https?:\/\//.test(url)) {
                url = 'http://' + url;
            }
            mecha.sendReact(m.chat, '🕒', m.key);
            try {
                const res = await gofile(url);
                m.reply(JSON.stringify(res, null, 2));
                delete database[jid];
            } catch (err) {
                m.reply(`Maaf, gagal mengambil konten dari URL Gofile: ${err}`);
                delete database[jid];
            }
        }
    },
    limit: true
};