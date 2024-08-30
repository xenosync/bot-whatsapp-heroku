const axios = require('axios');
let spotifyToken = '';
let tokenExpiry = 0;
exports.run = {
    usage: ['spotify'],
    use: 'parameter',
    category: 'downloader',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'terlambat untuk berdusta'));
        mecha.sendReact(m.chat, '🕒', m.key);
        const result = await searchSpotify(m.text);
        if (result.length === 0) return m.reply('Data empty.');
        let rows = result.map((track, index) => ({
            title: `${index + 1}. ${track.name} - ${track.artists}`,
            description: `- Duration : ${track.duration}\n- Popularity : ${track.popularity}`,
            id: `${m.prefix}spotifydl ${track.link}`
        }));
        let sections = [{ title: 'S P O T I F Y - S E A R C H', rows }];
        let buttons = [['list', 'Click Here ⎙', sections]];
        mecha.sendButton(m.chat, `Result from: \`${m.text}\``, 'select the list button below.', 'Powered by : https://api.spotify.com', buttons, m, { expiration: m.expiration });
    },
    premium: true,
    limit: true
};
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
