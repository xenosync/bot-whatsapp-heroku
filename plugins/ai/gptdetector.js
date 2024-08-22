const axios = require('axios');

const chatMemory = {};

exports.run = {
    usage: ['gptdetector'],
    hidden: [],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'Berikan teks yang ingin diperiksa'));
        }
        mecha.sendReact(m.chat, '🕒', m.key);

        const options = {
            method: 'POST',
            url: 'https://chatgpt-detector-ai-checker.p.rapidapi.com/v2/predict/text',
            headers: {
                'x-rapidapi-key': '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
                'x-rapidapi-host': 'chatgpt-detector-ai-checker.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                document: m.text,
                writing_stats_required: true,
                interpretability_required: false
            }
        };

        try {
            const response = await axios.request(options);
            const result = response.data;

            let detectionResult = 'Hasil deteksi:\n';
            detectionResult += `Prediksi Kelas: ${result.documents[0].predicted_class}\n`;
            detectionResult += `Tingkat Kepercayaan: ${result.documents[0].confidence_score * 100}%\n`;
            detectionResult += `Keterangan: ${result.documents[0].result_message}`;

            mecha.reply(m.chat, detectionResult, m, {
                expiration: m.expiration
            });
        } catch (error) {
            console.error(error);
            return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};