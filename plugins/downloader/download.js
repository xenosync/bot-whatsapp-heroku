const f = require('node-fetch');
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

async function fetchFromAPI(url) {
    const baseUrl = "https://api.cobalt.tools/api";
    const requestBody = {
        url,
        vCodec: "h264",
        vQuality: "720",
        aCodec: "aac",
        aFormat: "best",
        filenamePattern: "classic",
        isAudioOnly: false,
        isTTFullAudio: false,
        isAudioMuted: false,
        dubLang: false,
        disableMetadata: false,
        twitterGif: false,
        tiktokH265: false
    };
    try {
        const response = await f(`${baseUrl}/json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Origin": baseUrl,
                "Referer": baseUrl,
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36"
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
        }
        return response.json();
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
    }
}

async function handleAPIResponse(result) {
    try {
        if (result.status === 'picker' && Array.isArray(result.picker) && result.picker.length > 0) {
            return result.picker.map(i => i.url);
        }
        if (['success', 'stream'].includes(result.status) && result.url) {
            return [result.url];
        }
        if (result.status === 'redirect' && result.url) {
            const redirectedResult = await fetchFromAPI(result.url);
            return handleAPIResponse(redirectedResult);
        }
        throw new Error(`API response status: ${result.status}, message: ${result.text || 'No message'}`);
    } catch (error) {
        throw new Error(`Error handling API response: ${error.message}`);
    }
}

async function processDownload(url) {
    if (!isValidUrl(url)) {
        throw new Error('Invalid URL');
    }
    const result = await fetchFromAPI(url);
    return handleAPIResponse(result);
}

exports.run = {
    usage: ['download'],
    hidden: ['dl'],
    use: 'link',
    category: 'downloader',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'https://youtube.com/watch?v=T2Bu56uZtlM'));
        }
        await mecha.sendReact(m.chat, '🕒', m.key);
        const startTime = Date.now();
        try {
            const urls = await processDownload(m.text);
            if (urls.length === 0) {
                throw new Error('No download links found');
            }
            await Promise.all(urls.map(url => mecha.sendMedia(m.chat, url, m, { expiration: m.expiration })));
            const endTime = Date.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(3);
            await mecha.sendMessage(m.chat, { text: `*Waktu Proses*: ${processingTime} Detik` }, { quoted: m });
        } catch (e) {
            await mecha.sendMessage(m.chat, { text: `Error: ${e.message}` }, { quoted: m });
        }
    },
    limit: true,
};