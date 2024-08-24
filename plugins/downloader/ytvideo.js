const axios = require('axios');

async function fetchVideoData(url) {
    try {
        const { data } = await axios.get('https://ytstream-download-youtube-videos.p.rapidapi.com/dl', {
            params: { id: extractVideoId(url) },
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
            }
        });
        return data;
    } catch (error) {
        throw new Error('Gagal mengambil data video: ' + error.message);
    }
}

function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w\-_]{11})/);
    return match ? match[1] : null;
}

exports.run = {
    usage: ['ytvideo'],
    hidden: ['ytmp4', 'ytv'],
    use: 'link youtube',
    category: 'downloader',
    async: async (m, { mecha }) => {
        const videoId = extractVideoId(m.text);
        if (!videoId) return mecha.sendMessage(m.chat, { text: `Usage: ${m.cmd} <youtube_link>` }, { quoted: m });

        await mecha.sendReact(m.chat, '🕒', m.key);

        try {
            const data = await fetchVideoData(m.text);
            const { title, formats } = data;
            const videoFormat = formats.find(format => format.itag === 18);
            if (!videoFormat) throw new Error('URL video tidak ditemukan');

            await mecha.sendMessage(m.chat, {
                video: { url: videoFormat.url },
                mimetype: 'video/mp4',
                fileName: 'video.mp4',
                caption: `*Judul*: ${title ? title.trim() : 'Unknown Title'}`
            }, { quoted: m, ephemeralExpiration: m.expiration });

            await mecha.sendReact(m.chat, '✅', m.key);
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    premium: false,
    limit: 10
};
