exports.run = {
usage: ['prodia'],
use: 'params',
category: 'ai',
async: async (m, { func, mecha }) => {
const { createProdia } = require('prodia');
if (!m.text) return m.reply(func.example(m.cmd, 'puppies in a cloud'))
mecha.sendReact(m.chat, '🕒', m.key)
const prodia = createProdia({
apiKey: "5e528cdb-5228-4b78-bb70-798f722ed4fd",
});

const data = await prodia.generate({
prompt: m.text
});

// check status and view your image :)
const { job, status, imageUrl } = await prodia.wait(data);
if (status != 'succeeded') return m.reply(status)
mecha.sendMessage(m.chat, {
image: {
url: imageUrl
},
caption: status
}, {quoted: m, ephemeralExpiration: m.expiration})
},
premium: true
}