const axios = require('axios');

async function threads(url) {
    const apiUrl = `https://api.agatz.xyz/api/threads?url=${url}`;
    try {
        const { data } = await axios.get(apiUrl);
        if (data.status !== 200) {
            throw new Error('Failed to fetch data from Threads API');
        }
        const result = [];
        if (data.data.image_urls.length > 0) {
            data.data.image_urls.forEach(imageUrl => {
                result.push({ type: 'image', url: imageUrl });
            });
        }
        if (data.data.video_urls.length > 0) {
            data.data.video_urls.forEach(video => {
                result.push({ type: 'video', url: video.download_url });
            });
        }
        return { status: true, result };
    } catch (error) {
        console.error("Error:", error);
        return { status: false, message: String(error) };
    }
}

exports.run = {
    usage: ['threads'],
    hidden: ['thdl'],
    use: 'link threads',
    category: 'downloader',
    async: async (m, { func, mecha, isPrem, mess }) => {
        let url; 
        if (m.quoted && m.quoted.text) { 
            url = m.quoted.text.trim(); 
        } else { 
            url = m.text.trim(); 
        }
        const threadsUrlPattern = /https:\/\/www\.threads\.net\/@/gi;
        if (!url) return m.reply(func.example(m.cmd, 'https://www.threads.net/@kalekkl/post/C8bhQGPyKEm/?xmt=AQGzc5jjHV_aIKyD-2Y6zHlDCXA6Pv7PEZZnAvMVJx7UJg'));
        if (!threadsUrlPattern.test(url)) return m.reply(mess.error.url);
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const res = await threads(url);
            if (!res.status) return m.reply(res.message);
            for (let i of res.result) {
                if (i.type === 'video') {
                    await mecha.sendMessage(m.chat, { video: { url: i.url } }, { quoted: m, ephemeralExpiration: m.expiration });
                } else if (i.type === 'image') {
                    await mecha.sendMedia(m.chat, i.url, m, { expiration: m.expiration });
                }
                await func.delay(500);
            }
        } catch (err) {
            m.reply('Maaf terjadi kesalahan.');
        }
    },
    premium: true,
    limit: 5
};