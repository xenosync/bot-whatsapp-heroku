const axios = require('axios');

async function fetchVideoData(videoUrl) {
    const response = await axios.get('https://api.alyachan.dev/api/aio', {
        params: { url: videoUrl, apikey: '6nY0bL' }
    });
    return response.data;
}

function extractVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w\-_]{11})/);
    return match ? match[1] : null;
}

exports.run = {
    usage: ['ytvideo3'],
    hidden: ['ytmp43', 'ytv3'],
    use: 'link youtube',
    category: 'downloader',
    async: async (m, { mecha }) => {
        const videoUrl = m.text;
        const videoId = extractVideoId(videoUrl);
        if (!videoId) return m.reply(`Usage: ${m.cmd} <youtube_link>`);
        await mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const videoData = await fetchVideoData(videoUrl);
            const title = videoData.title || 'Unknown Title';
            const videoUrlMp4 = videoData.medias.find(media => media.extension === 'mp4')?.url;
            const audioUrl = videoData.medias.find(media => media.extension === 'mp3')?.url;
            const caption = `*Judul*: ${title}\n*Durasi*: ${videoData.duration}`;

            if (videoUrlMp4) {
                await mecha.sendMessage(m.chat, {
                    video: { url: videoUrlMp4 },
                    mimetype: 'video/mp4',
                    fileName: 'video.mp4',
                    caption: caption
                }, { quoted: m, ephemeralExpiration: m.expiration });
            } else if (audioUrl) {
                await mecha.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mp4',
                    fileName: 'audio.mp3',
                    caption: caption
                }, { quoted: m, ephemeralExpiration: m.expiration });
            } else {
                await mecha.sendMessage(m.chat, { text: 'No video or audio found for this URL.' }, { quoted: m });
            }
            await mecha.sendReact(m.chat, '✅', m.key);
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    premium: false,
    limit: 10
};
