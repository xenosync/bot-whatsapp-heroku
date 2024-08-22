const axios = require('axios'), fetchAudioData = async (id) => 
    (await axios.get('https://yt-api.p.rapidapi.com/dl', {
        params: { id }, 
        headers: { 
            'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9', 
            'x-rapidapi-host': 'yt-api.p.rapidapi.com' 
        }
    })).data;

const extractVideoId = url => (url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w\-_]{11})/) || [])[1];

exports.run = {
    usage: ['ytaudio'],
    hidden: ['yta', 'ytmp3'],
    use: 'link youtube',
    category: 'downloader',
    async: async (m, { mecha }) => {
        const id = extractVideoId(m.text);
        if (!id) return m.reply(`Usage: ${m.cmd} <youtube_link>`);
        await mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const { title = 'Unknown Title', formats } = await fetchAudioData(id);
            const [audioUrl] = formats.map(f => f.url);
            await mecha.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: 'file.mp3',
                caption: `*Judul*: ${title}`
            }, { quoted: m, ephemeralExpiration: m.expiration });
            await mecha.sendReact(m.chat, '✅', m.key);
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    premium: false,
    limit: 5
};