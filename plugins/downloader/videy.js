exports.run = {
    usage: ['videy'],
    hidden: ['videydl'],
    use: 'link videy',
    category: 'downloader',
    async: async (m, { func, mecha, isPrem, mess }) => {
        let url; 
        if (m.quoted && m.quoted.text) { 
            url = m.quoted.text.trim(); 
        } else { 
            url = m.text.trim(); 
        }
        const videyUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:videy\.co\/v\?id=)(?:[\w\-._~:/?#[\]@!$&'()*+,;=]*)?/;
        if (!url) return m.reply(func.example(m.cmd, 'https://videy.co/v?id=6eWSwq2t'));
        if (!videyUrlPattern.test(url)) return m.reply(mess.error.url);
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const apiUrl = `https://api.agatz.xyz/api/videydl?url=${encodeURIComponent(url)}`;
            const res = await fetch(apiUrl);
            const json = await res.json();
            if (json.status !== 200) return m.reply(mess.error.api);
            await mecha.sendMessage(m.chat, { video: { url: json.data } }, { quoted: m, ephemeralExpiration: m.expiration });
            await mecha.sendMessage(m.chat, { document: { url: json.data }, mimetype: 'video/mp4', fileName: `videy_download.mp4` }, { quoted: m });
        } catch (err) {
            m.reply('Maaf terjadi kesalahan.');
        }
    },
    premium: true,
    limit: 5
}