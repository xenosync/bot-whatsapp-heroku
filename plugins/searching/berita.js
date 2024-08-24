const axios = require('axios');

const berita = async () => {
    try {
        const response = await axios.get('https://api.alyachan.dev/api/cnn?&apikey=6nY0bL');
        const beritaData = response.data.data;
        if (!beritaData || beritaData.length === 0) {
            throw new Error('Data berita tidak ditemukan.');
        }
        return beritaData.slice(0, 10).map(item => ({
            title: item.title,
            url: item.url
        }));
    } catch (error) {
        throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
};

exports.run = {
    usage: ['berita'],
    category: 'searching',
    async: async (m, { mecha }) => {
        try {
            const beritaList = await berita();
            let beritaText = '*Berita Terbaru:*\n\n';
            beritaList.forEach((item, index) => {
                beritaText += `${index + 1}. ${item.title}\nBaca Selengkapnya: ${item.url}\n\n`;
            });
            beritaText = beritaText.trim();  // Menghilangkan enter yang tidak perlu
            await mecha.reply(m.chat, beritaText, m);
        } catch (error) {
            await mecha.reply(m.chat, `Terjadi kesalahan: ${error.message}`, m);
        }
    },
    limit: true
};
