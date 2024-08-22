const axios = require('axios');
const crypto = require('crypto');
const generateSessionToken = () => crypto.randomBytes(16).toString('hex');
const fetchAIResponse = async (prompt) => {
    const sessionToken = generateSessionToken();
    try {
        await axios.post("https://thobuiq-gpt-4o.hf.space/run/predict?__theme=light", { //register prompt and initiate request
            data: [{ text: prompt, files: [] }],
            event_data: null,
            fn_index: 3,
            session_hash: sessionToken,
            trigger_id: 18,
        }, {
            headers: {
                Origin: "https://thobuiq-gpt-4o.hf.space",
                "User-Agent": "Mozilla/5.0",
            },
        });
        await axios.post("https://thobuiq-gpt-4o.hf.space/queue/join?__theme=light", { //join the processing queue
            data: [null, null, "idefics2-8b-chatty", "Greedy", 0.7, 4096, 1, 0.9],
            event_data: null,
            fn_index: 5,
            session_hash: sessionToken,
            trigger_id: 18,
        }, {
            headers: {
                Origin: "https://thobuiq-gpt-4o.hf.space",
                "User-Agent": "Mozilla/5.0",
            },
        });        
        const response = await axios.get(`https://thobuiq-gpt-4o.hf.space/queue/data?${new URLSearchParams({ session_hash: sessionToken })}`, { //stream and process the response
            headers: {
                Accept: "text/event-stream",
                "User-Agent": "Mozilla/5.0",
            },
            responseType: 'stream',
        });
        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                const data = JSON.parse(chunk.toString().split("data: ")[1] || '{}');
                if (data.msg === 'process_completed') {
                    const result = data.output?.data[0][0][1] || 'Failed to get response.';
                    resolve(result);
                }
            });
            response.data.on('error', (err) => reject(`Stream error: ${err.message}`));
        });
    } catch (error) {
        throw new Error(`Failed to fetch AI response: ${error.message}`);
    }
};
const processAIRequest = async (m, mecha) => {
    if (!m.text) {
        return m.reply('Please provide a clear question or command.');
    }
    mecha.sendReact(m.chat, '🕒', m.key);
    try {
        const responseText = await fetchAIResponse(m.text);
        mecha.reply(m.chat, responseText, m);
    } catch (error) {
        mecha.reply(m.chat, `An error occurred: ${error.message}`, m);
    }
};
exports.run = {
    usage: [],
    hidden: ['ai2'],
    use: 'question',
    category: 'ai',
    async: (m, { func, mecha }) => processAIRequest(m, mecha),
    limit: true
};