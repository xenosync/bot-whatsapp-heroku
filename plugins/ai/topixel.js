const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

async function uploadImageToTelegraph(buffer) {
    const { ext, mime } = await fromBuffer(buffer) || {};
    const form = new FormData();
    form.append("file", buffer, {
        filename: `tmp.${ext}`,
        contentType: mime
    });
    const { data } = await axios.post('https://telegra.ph/upload', form, { headers: form.getHeaders() });
    if (data[0]?.src) return 'https://telegra.ph' + data[0].src;
    throw new Error('Upload failed.');
}

async function processing(imageUrl) {
    const apiUrl = `https://api.alyachan.dev/api/topixel?image=${encodeURIComponent(imageUrl)}&apikey=6nY0bL`;
    const { data } = await axios.get(apiUrl);
    if (data?.status) return data.data.url;
    throw new Error('Processing failed.');
}

exports.run = {
    usage: ['topixel'],
    use: 'reply photo',
    category: 'ai',
    async: async (m, { mecha, quoted }) => {
        if (!quoted?.mime || !/image\/(jpe?g|png|video)/.test(quoted.mime)) return m.reply(`Invalid media.`);
        mecha.topixel = mecha.topixel || {};
        if (m.sender in mecha.topixel) return m.reply('Process ongoing.');
        mecha.topixel[m.sender] = true;
        mecha.sendReact(m.chat, '🕒', m.key);

        let media = await quoted.download();
        try {
            let imageUrl = await uploadImageToTelegraph(media);
            let resultUrl = await processing(imageUrl);
            await mecha.sendMessage(m.chat, { image: { url: resultUrl }, caption: 'Pixel art generated.' });
        } catch (err) {
            m.reply(`Error: ${err.message}`);
        } finally {
            delete mecha.topixel[m.sender];
        }
    },
    premium: true
};