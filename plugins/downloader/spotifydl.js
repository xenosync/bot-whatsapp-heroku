const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
exports.run = {
    usage: ['spotifydl'],
    use: 'parameter',
    category: 'downloader',
    async: async (m, { mecha }) => {
        if (!m.text) return m.reply(`Usage: ${m.cmd} url\n\nExample: *${m.cmd} https://open.spotify.com/track/4O6k4SPSTBvohXJcaeZd46*`);
        if (!m.args[0].includes('open.spotify.com/track')) return m.reply(global.mess.error.url);
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const res = await spotifydl(m.args[0]);
            const message = await mecha.sendMessage(m.chat, { image: { url: res.image }, caption: `*S P O T I F Y - D O W N L O A D E R*\n\n◦ Title: ${res.title}\n◦ Duration: ${res.duration}\n◦ Artist: ${res.artist}\n\n_Please wait audio is being sent..._` });
            await mecha.sendMessage(m.chat, { audio: { url: res.download }, mimetype: 'audio/mpeg' }, { quoted: message, ephemeralExpiration: m.expiration });
            mecha.sendReact(m.chat, '✅', m.key);
        } catch (error) {
            try {
                const res = await spotifyScraper(m.args[0]);
                const message = await mecha.sendMessage(m.chat, { image: { url: res.thumbnail }, caption: `*S P O T I F Y - D O W N L O A D E R*\n\n◦ Title: ${res.title}\n◦ Duration: ${res.duration || 'Unknown'}\n◦ Artist: ${res.artist}\n\n_Please wait audio is being sent..._` });
                await mecha.sendMessage(m.chat, { audio: { url: res.music }, mimetype: 'audio/mpeg' }, { quoted: message, ephemeralExpiration: m.expiration });
                mecha.sendReact(m.chat, '✅', m.key);
            } catch (error) {
                mecha.sendReact(m.chat, '❌', m.key);
                m.reply('Error while processing your request.');
            }
        }
    },
    premium: true,
    limit: true
};
async function spotifydl(url) {
    try {
        const data = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`);
        const res = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${data.data.result.gid}/${data.data.result.id}`);
        return {
            creator: 'SuryaDev.',
            title: data.data.result.name,
            type: data.data.result.type,
            artist: data.data.result.artists,
            duration: convert(data.data.result.duration_ms),
            image: data.data.result.image,
            download: 'https://api.fabdl.com' + res.data.result.download_url,
        };
    } catch (error) {
        throw error;
    }
}
async function spotifyScraper(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get("https://spotifymate.com/en", {
                headers: {
                    cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                },
            });
            const $ = cheerio.load(response.data);
            const form = $("form#get_video");
            const hiddenInput = form.find('input[type="hidden"]');
            const formData = new FormData();
            formData.append("url", url);
            formData.append(hiddenInput.attr("name"), hiddenInput.attr("value"));
            const downloadPage = await axios.post("https://spotifymate.com/action", formData, {
                headers: {
                    origin: "https://spotifymate.com/en",
                    ...formData.getHeaders(),
                    cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                },
            });
            if (downloadPage.statusText !== "OK") return reject("Fail Fetching");
            const $$ = cheerio.load(downloadPage.data);
            const result = {
                title: $$(".dlvideos h3[itemprop='name']").text().trim(),
                artist: $$(".dlvideos .spotifymate-downloader-middle > p > span").text().trim(),
                thumbnail: $$(".dlvideos img").attr("src") || "",
                music: $$(".dlvideos .spotifymate-downloader-right #none a").eq(0).attr("href") || "",
                duration: "Unknown"
            };
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
function convert(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
