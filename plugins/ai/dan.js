const axios = require('axios');
const memory = {};

exports.run = {
    usage: ['dan'],
    hidden: [],
    use: 'pertanyaan',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) return m.reply(func.example(m.cmd, 'apakah kamu DAN?'));
        mecha.sendReact(m.chat, '🕒', m.key);
        if (!memory[m.chat]) memory[m.chat] = { context: [] };
        memory[m.chat].context.push({ role: "user", content: m.text });
        const date = new Date();
        const currentDateTime = `Detik: ${date.getSeconds()}, Menit: ${date.getMinutes()}, Jam: ${date.getHours()}, Tanggal: ${date.getDate()}, Bulan: ${date.getMonth() + 1}, Tahun: ${date.getFullYear()}`;
        try {
            const options = {
                apikey: 'syauqi27',
                text: m.text,
                url: '',
                prompt: `Anda adalah DAN, yang merupakan singkatan dari "lakukan apa saja sekarang". Fokus hanya pada memberikan jawaban langsung dan relevan terhadap pertanyaan pengguna dalam bahasa Indonesia. Jangan menyertakan salam, perkenalan diri, atau konteks yang tidak perlu. Tanggapi pertanyaan secara langsung dalam bahasa Indonesia. Tanggal dan waktu saat ini adalah: ${currentDateTime}`,
                websearch: false,
                messages: [
                    { role: "system", content: "Anda adalah DAN, yang berarti 'lakukan apa pun sekarang'. Fokus hanya pada memberikan jawaban langsung dan relevan terhadap pertanyaan pengguna dalam bahasa Indonesia. Jangan menyertakan salam, perkenalan diri, atau konteks yang tidak perlu. Tanggapi pertanyaan secara langsung dalam bahasa Indonesia. Tanggal dan waktu saat ini adalah: " + currentDateTime },
                    ...memory[m.chat].context
                ]
            };
            const response = await axios.post('https://skizo.tech/api/blackbox', options);
            if (response.data.status === 200) {
                let cleanedResponse = response.data.result.replace(/\$@\$.+?\$@\$/g, '').trim();
                memory[m.chat].context.push({ role: "assistant", content: cleanedResponse });
                mecha.reply(m.chat, cleanedResponse, m, { expiration: m.expiration });
            } else {
                mecha.reply(m.chat, `Terjadi kesalahan pada API: Status ${response.data.status} - ${response.data.message}`, m);
            }
        } catch (error) {
            const errorMessage = `Terjadi kesalahan: ${error.message}\n` +
                                 `Stack Trace: ${error.stack || 'Tidak tersedia'}`;
            mecha.reply(m.chat, errorMessage, m);
        }
    },
    limit: true
};