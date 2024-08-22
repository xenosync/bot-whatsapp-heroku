const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.run = {
    usage: [],
    hidden: ['aisearch'],
    use: 'question',
    category: 'ai',
    async: async (m, { mecha }) => {
        if (!m.text) return mecha.reply(m.chat, 'Harap berikan pertanyaan.', m);
        mecha.sendReact(m.chat, '🕒', m.key);
        try {
            const { data } = await axios.get('https://api.sanzy.co/api/ai-search', {
                params: { text: m.text },
                headers: { 'accept': 'application/json' }
            });
            if (!data.status) return mecha.reply(m.chat, 'Maaf, tidak ada data yang ditemukan.', m);
            const mediaFiles = [];
            let resultText = '';
            for (const item of data.data) {
                if (item.type === 'expand_type') {
                    for (const image of item.images) {
                        try {
                            const { data: imageData, headers } = await axios.get(image.link, { responseType: 'arraybuffer' });
                            if (headers['content-type'].startsWith('image/') && imageData.length > 0) {
                                const filePath = path.join(__dirname, `temp_${Date.now()}.jpg`);
                                fs.writeFileSync(filePath, imageData);
                                mediaFiles.push({ path: filePath, caption: `*${image.title}*\nLink: ${image.image.contextLink}\n`.trim() });
                            }
                        } catch (error) {
                            console.error(`Gagal mengambil file dari ${image.link}: ${error.message}`);
                        }
                    }
                } else if (item.type === 'combined_text') {
                    const cleanedText = item.text
                        .replace(/###/g, '')
                        .replace(/\*\*/g, '*');                    
                    resultText += `${cleanedText.trim()}\n\n`;
                }
            }
            for (const { path: filePath, caption } of mediaFiles) {
                try {
                    await mecha.sendMedia(m.chat, filePath, null, { caption });
                    fs.unlinkSync(filePath);
                } catch (error) {
                    console.error(`Gagal mengirim media: ${error.message}`);
                }
            }
            if (resultText.trim()) {
                mecha.reply(m.chat, `Berikut adalah hasil pencarian:\n\n${resultText.trim()}`, m);
            } else {
                mecha.reply(m.chat, 'Maaf, saya tidak dapat menemukan informasi terkait pertanyaan Anda.', m);
            }
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            mecha.reply(m.chat, "Terjadi kesalahan saat memproses permintaan Anda.", m);
        }
    },
    limit: true
};