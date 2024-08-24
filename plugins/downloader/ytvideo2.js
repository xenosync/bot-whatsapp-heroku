const axios = require('axios');

async function fetchVideoData(url) {
    const response = await axios.get('https://api.kyuurzy.site/api/download/aio', {
        params: { query: url }
    });
    return response.data;
}

function extractVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w\-_]{11})/);
    return match ? match[1] : null;
}

exports.run = {
    usage: [],
    hidden: ['ytvideo2', ' ytmp42', 'ytv2'],
    use: 'link youtube',
    category: 'downloader',
    async: async (m, { mecha }) => {
        const videoUrl = m.text;
        const videoId = extractVideoId(videoUrl);
        if (!videoId) return m.reply(`Usage: ${m.cmd} <youtube_link>`);
        
        await mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const videoData = await fetchVideoData(videoUrl);
            if (!videoData.status) return m.reply(`Error: ${videoData.message}`);
            
            await mecha.sendMessage(m.chat, {
                video: { url: videoData.result.url },
                mimetype: 'video/mp4',
                fileName: 'video.mp4'
            }, { quoted: m, ephemeralExpiration: m.expiration });
            
            await mecha.sendReact(m.chat, '✅', m.key);
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    premium: false,
    limit: 10
};
