const axios = require('axios');
async function encryptUsingXterm(code) {
    try {
        const response = await axios.get(`https://ai.xterm.codes/api/tools/js-protector?code=${encodeURIComponent(code)}`);
        return response.data.status ? response.data.data : null;
    } catch (error) {
        return { status: 1, error: error.message };
    }
}
async function createPaste(content) {
    const data = {
        key: "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE",
        description: "Paste created via API",
        sections: [{ name: "Section 1", syntax: "text", contents: content }],
        expires: "1w"
    };
    try {
        const response = await axios.post("https://api.paste.ee/v1/pastes", data, {
            headers: { "Content-Type": "application/json", "X-Auth-Token": "abFFSw5uEbwkh1APp0hRTbwXgU4B9DZZwf7rjRPZE" }
        });
        const result = response.data;
        return result ? { status: 0, raw: result.link.replace('/p/', '/r/') + "/0" } : { status: 1 };
    } catch (error) {
        return { status: 1, error: error.message };
    }
}
exports.run = {
    usage: ['enkrip2'],
    category: 'owner',
    async: async (m, { mecha, quoted }) => {
        if (!quoted) return m.reply('Harap reply ke pesan yang ingin di-enkrip.');
        const data = quoted.mimetype === 'text/plain' || !quoted.mimetype ? quoted.text : null;
        if (!data) return m.reply('Harap reply ke pesan teks.');
        const encryptedCode = await encryptUsingXterm(data);
        if (!encryptedCode || encryptedCode.status === 1) return m.reply('Gagal mengenkripsi pesan.');
        const response = await createPaste(encryptedCode);
        const encryptedInfo = response.status === 0 ? response.raw : `Error: ${response.error}`;
        await mecha.sendReact(m.chat, '✅', m.key);
        await m.reply(encryptedInfo);
    },
    devs: true
};
