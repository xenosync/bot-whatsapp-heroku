const axios = require('axios');

async function fetchVideoData(videoId) {
    try {
        const { data } = await axios.get('https://ytstream-download-youtube-videos.p.rapidapi.com/dl', {
            params: { id: videoId },
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1db8e4c9',
                'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
            }
        });
        return data;
    } catch (e) {
        throw new Error(`Fetch Error: ${e.message}`);
    }
}

function extractVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w\-_]{11})/);
    return match ? match[1] : null;
}

exports.run = {
    usage: ['ytvideo'],
    hidden: ['ytmp4', 'ytv'],
    use: 'link youtube',
    category: 'downloader',
    async: async (m, { mecha }) => {
        const videoId = extractVideoId(m.text);
        if (!videoId) return m.reply(`Usage: ${m.cmd} <youtube_link>`);
        await mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const { formats, title = 'Unknown Title', channelTitle = 'Unknown Author', description = 'No description available' } = await fetchVideoData(videoId);
            const videoUrl = formats.find(format => format.itag === 18)?.url;
            if (!videoUrl) throw new Error('Video URL not found.');
            const caption = `*Judul*: ${title}\n*Author*: ${channelTitle}\n*Deskripsi*:\n\n${description}`;
            await mecha.sendMessage(m.chat, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                fileName: 'video.mp4',
                caption: caption
            }, { quoted: m, ephemeralExpiration: m.expiration });
            await mecha.sendReact(m.chat, '✅', m.key);
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    premium: false,
    limit: 5
};