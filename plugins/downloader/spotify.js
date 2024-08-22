const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

let spotifyToken = '';
let tokenExpiry = 0;

exports.run = {
    usage: ['spotify', 'spotifydl'],
    use: 'parameter',
    category: 'downloader',
    async: async (m, { func, mecha }) => {
        switch (m.command) {
            case 'spotify': {
                if (!m.text) return m.reply(func.example(m.cmd, 'terlambat untuk berdusta'));
                mecha.sendReact(m.chat, '🕒', m.key);
                const result = await searchSpotify(m.text);
                if (result.length == 0) return m.reply('Data empty.');
                let rows = result.map((track, index) => ({
                    title: `${index + 1}. ${track.name} - ${track.artists}`,
                    description: `- Duration : ${track.duration}\n- Popularity : ${track.popularity}`,
                    id: `${m.prefix}spotifydl ${track.link}`
                }));
                let sections = [{ title: 'S P O T I F Y - S E A R C H', rows }];
                let buttons = [['list', 'Click Here ⎙', sections]];
                mecha.sendButton(m.chat, `Result from: \`${m.text}\``, 'select the list button below.', 'Powered by : https://api.spotify.com', buttons, m, { expiration: m.expiration });
            }
            break;
            case 'spotifydl': {
                if (!m.text) return m.reply(`Usage: ${m.cmd} url\n\nExample: *${m.cmd} https://open.spotify.com/track/4O6k4SPSTBvohXJcaeZd46*`);
                if (!m.args[0].includes('open.spotify.com/track')) return m.reply(global.mess.error.url);
                mecha.sendReact(m.chat, '🕒', m.key);
                try {
                    // Attempt old method first
                    const res = await spotifydl(m.args[0]);
                    const message = await mecha.sendMessage(m.chat, { image: { url: res.image }, caption: `*S P O T I F Y - D O W N L O A D E R*\n\n◦ Title: ${res.title}\n◦ Duration: ${res.duration}\n◦ Artist: ${res.artist}\n\n_Please wait audio is being sent..._` });
                    await mecha.sendMessage(m.chat, { audio: { url: res.download }, mimetype: 'audio/mpeg' }, { quoted: message, ephemeralExpiration: m.expiration });
                    mecha.sendReact(m.chat, '✅', m.key);
                } catch (error) {
                    try {
                        // Use new scraper if old method fails
                        const res = await spotifyScraper(m.args[0]);
                        const message = await mecha.sendMessage(m.chat, { image: { url: res.thumbnail }, caption: `*S P O T I F Y - D O W N L O A D E R*\n\n◦ Title: ${res.title}\n◦ Duration: ${res.duration || 'Unknown'}\n◦ Artist: ${res.artist}\n\n_Please wait audio is being sent..._` });
                        await mecha.sendMessage(m.chat, { audio: { url: res.music }, mimetype: 'audio/mpeg' }, { quoted: message, ephemeralExpiration: m.expiration });
                        mecha.sendReact(m.chat, '✅', m.key);
                    } catch (error) {
                        mecha.sendReact(m.chat, '❌', m.key);
                        m.reply('Error while processing your request.');
                    }
                }
            }
            break;
        }
    },
    premium: true,
    limit: true
};

// Old method function
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

// New method function
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
                duration: "Unknown" // Duration is not available in the new method
            };
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

async function searchSpotify(query) {
    try {
        if (!spotifyToken || Date.now() > tokenExpiry) {
            spotifyToken = await getAccessToken();
            tokenExpiry = Date.now() + 3600 * 1000;
        }
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
            headers: { Authorization: `Bearer ${spotifyToken}` },
        });
        return response.data.tracks.items.map(item => ({
            name: item.name,
            artists: item.artists.map(artist => artist.name).join(', '),
            popularity: item.popularity,
            link: item.external_urls.spotify,
            image: item.album.images[0].url,
            duration: convert(item.duration_ms),
        }));
    } catch (error) {
        console.error('Error searching Spotify:', error);
        throw 'An error occurred while searching for songs on Spotify.';
    }
}

async function getAccessToken() {
    try {
        const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3';
        const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009';
        const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw 'An error occurred while obtaining Spotify access token.';
    }
}

function convert(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}