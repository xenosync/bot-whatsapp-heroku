const axios = require('axios');

async function createPaste(content) {
    const data = {
        key: "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE",
        description: "Paste created via API",
        sections: [{ name: "Section 1", syntax: "text", contents: content }],
        expires: "1w"
    };
    try {
        const response = await axios.post("https://api.paste.ee/v1/pastes", data, {
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE"
            }
        });
        const result = response.data;
        const rawUrl = result.link.replace('/p/', '/r/') + "/0";
        return result ? 
            { status: 0, original: result.link, raw: rawUrl, expires: data.expires } : 
            { status: 1, original: null, raw: null, error: "Failed to create paste" };
    } catch (error) {
        return logError(error);
    }
}

async function processMessage(m, { func, mecha }) {
    const teks = m.quoted ? m.quoted.text : m.text;
    if (!teks) return mecha.reply(m.chat, 'No text found');
    await mecha.sendReact(m.chat, '🕒', m.key);
    try {
        const response = await createPaste(teks);
        const pesan = formatResponse(response);
        await mecha.reply(m.chat, pesan, m);
    } catch (error) {
        const errorMessage = formatResponse(logError(error));
        await mecha.reply(m.chat, errorMessage, m);
    }
}

function logError(error) {
    console.error("[ERROR]", error);
    return {
        status: 1,
        original: null,
        raw: null,
        error: error.response ? error.response.data : error.message
    };
}

function formatResponse(response) {
    return response.status === 0 ? 
        `${response.raw}` :
        `*Error:* ${response.error}`;
}

exports.run = {
    usage: ['paste'],
    hidden: [],
    category: 'tools',
    async: async (m, { func, mecha }) => {
        console.time("processMessage");
        await processMessage(m, { func, mecha });
        console.timeEnd("processMessage");
    }
};