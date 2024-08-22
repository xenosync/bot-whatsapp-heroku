const axios = require('axios');
const moment = require('moment-timezone');
const chatMemory = {};
let currentApiKeyIndex = 0;
const apiKeys = [
    '1e30005f51msh6c612a2bd86806dp1dbed2jsne6909db8e4c9',
    'f5a94fb230msh7c64dcf143fec86p14ba71jsncfa9a7966ea5'
];

async function sendRequest(options) {
    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        if (currentApiKeyIndex < apiKeys.length - 1) {
            currentApiKeyIndex++;
            options.headers['x-rapidapi-key'] = apiKeys[currentApiKeyIndex];
            console.log(`Switching to API key index: ${currentApiKeyIndex}`);
            return sendRequest(options);
        } else {
            throw error;
        }
    }
}

exports.run = {
    usage: [],
    hidden: ['zero'],
    use: 'question',
    category: 'ai',
    async: async (m, { func, mecha }) => {
        if (!m.text) {
            return m.reply(func.example(m.cmd, 'Berikan pertanyaan untuk diajukan kepada GPT-4'));
        }
        mecha.sendReact(m.chat, '🕒', m.key);
        if (!chatMemory[m.chat]) {
            chatMemory[m.chat] = [];
        }
        chatMemory[m.chat].push({ role: 'user', content: m.text });
        const now = moment.tz('Asia/Jakarta');
        const formattedDate = now.format('D MMMM YYYY');
        const formattedTime = now.format('HH:mm:ss');
        const options = {
            method: 'POST',
            url: 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions',
            headers: {
                'x-rapidapi-key': apiKeys[currentApiKeyIndex],
                'x-rapidapi-host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                messages: [
                    { role: 'system', content: `Tanggal dan waktu saat ini: ${formattedDate}, ${formattedTime} WIB` },
                    ...chatMemory[m.chat],
                    { role: 'user', content: m.text }
                ],
                model: 'gpt-4o',
                max_tokens: 1000,
                temperature: 0.7
            }
        };
        try {
            const response = await sendRequest(options);
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const responseText = response.data.choices[0].message && response.data.choices[0].message.content
                    ? response.data.choices[0].message.content.trim()
                    : 'No response text available';
                chatMemory[m.chat].push({ role: 'assistant', content: responseText });
                const creditsRemaining = response.headers['x-ratelimit-credits-remaining'];
                const creditsLimit = response.headers['x-ratelimit-credits-limit'];
                if (creditsRemaining === '0') {
                    currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
                }
                const finalResponse = `${responseText}\n\nKredit Info: ${creditsRemaining}/${creditsLimit}`;
                mecha.reply(m.chat, finalResponse, m, {
                    expiration: m.expiration
                });
            } else {
                mecha.reply(m.chat, 'Tidak ada respons dari GPT-4', m);
            }
        } catch (error) {
            console.error(error);
            return mecha.reply(m.chat, `Terjadi kesalahan: ${String(error)}`, m);
        }
    },
    limit: true
};