const axios = require('axios');

async function ssweb(url) {
    const apiKey = 'syauqi27';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    const apiUrl = `https://skizo.tech/api/ssweb?apikey=${apiKey}&url=${encodeURIComponent(url)}&type=&language=id&fullpage=0&width=720&height=1280`;
    try {
        const { data, headers } = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        return headers['content-type'].includes('image') ? { status: true, result: data } : { status: false, message: 'Gagal mengambil tangkapan layar.' };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

exports.run = {
    usage: ['ssweb'],
    use: 'url',
    category: 'tools',
    async: async (m, { func, mecha }) => {
        if (!m.text || !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/i.test(m.text)) {
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
