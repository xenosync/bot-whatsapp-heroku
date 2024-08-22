const axios = require('axios');

// Menangani permintaan untuk fitur berita
exports.run = {
    usage: ['news <text>'],
    hidden: ['newsnow'],
    use: 'news',
    category: 'information',
    async: async (m, { func, mecha }) => {
        // Validasi input
        if (!m.text || m.text.split(' ').length < 2) {
            return m.reply(func.example(m.cmd, 'Berikan teks pencarian untuk berita'));
        }

        // Mendapatkan teks pencarian dari input pengguna
        const searchText = m.text.split(' ').slice(1).join(' ');

        // Memberi reaksi sebagai tanda proses sedang berlangsung
        mecha.sendReact(m.chat, '🕒', m.key);

        // Opsi untuk permintaan API
        const options = {
            method: 'POST',
            url: 'https://newsnow.p.rapidapi.com/',
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9', // Ganti dengan kunci API Anda
                'x-rapidapi-host': 'newsnow.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                text: searchText,
                region: 'ID', // Kode negara untuk Indonesia
                max_results: 5 // Jumlah berita yang diambil
            }
        };

        try {
            // Mengirim permintaan ke API
            const response = await axios.request(options);
            const articles = response.data.articles; // Sesuaikan dengan struktur respons API
            
            if (articles && articles.length > 0) {
                // Membuat pesan berita
                let newsMessage = `Berita Terkini tentang "${searchText}":\n\n`;
                articles.forEach((article, index) => {
                    newsMessage += `${index + 1}. ${article.title}\n${article.url}\n\n`;
                });
                mecha.reply(m.chat, newsMessage, m); // Mengirim pesan berita ke chat
            } else {
                mecha.reply(m.chat, `Tidak ada berita terbaru tentang "${searchText}" saat ini.`, m);
            }
        } catch (error) {
            // Menangani kesalahan permintaan API
            const errorMsg = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
            console.error("Error Response:", errorMsg);
            mecha.reply(m.chat, `Terjadi kesalahan saat mengambil berita: ${errorMsg}`, m);
        }
    },
    limit: true
};