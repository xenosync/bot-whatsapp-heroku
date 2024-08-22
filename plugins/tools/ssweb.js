const axios = require('axios');

async function ssweb(url) {
    const apiKey = 'syauqi27';
    const apiUrl = `https://skizo.tech/api/ssweb?apikey=${apiKey}&url=${encodeURIComponent(url)}&type=&language=id&fullpage=0&width=1080&height=1920`;
    try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const { data, headers } = response;
        if (headers['content-type'].includes('image')) {
            return { status: true, result: data };
        } else {
            return { status: false, message: 'Gagal mengambil tangkapan layar.' };
        }
    } catch (error) {
        return { status: false, message: error.message };
    }
}

exports.run = {
    usage: ['ssweb'],
    use: 'url',
    category: 'tools',
    async: async (m, { func, mecha }) => {
        if (!m.text || !func.isUrl(m.args[0])) {
            return m.reply('Masukkan URL yang valid.');
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        const res = await ssweb(m.text);
        if (!res.status) {
            return m.reply('Gagal mengambil tangkapan layar.');
        }
        mecha.sendMessage(m.chat, { image: res.result }, { quoted: m, ephemeralExpiration: m.expiration });
    },
    limit: 3
};