const axios = require('axios');

exports.run = {
usage: ['lbbai'],
hidden: ['gpt'],
use: 'text',
category: 'ai',
async: async (m, { func, mecha, users, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Hai'))
mecha.sendReact(m.chat, '🕒', m.key)
try {
let messageId = 'MECHA' + func.makeid(22).toUpperCase() + 'LBBAI'
let response = await Lbbai(m.text, users.name)
mecha.sendMessage(m.chat, {text: `${response}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
} catch (error) {
mecha.sendReact(m.chat, '❌', m.key)
return errorMessage(error)
}
},
main: async (m, { func, mecha, users, errorMessage }) => {
if (m.budy && m.quoted && m.quoted.fromMe && m.quoted.id.endsWith('LBBAI') && !m.isPrefix) {
mecha.sendReact(m.chat, '🕒', m.key)
try {
let messageId = 'MECHA' + func.makeid(22).toUpperCase() + 'LBBAI'
let response = await Lbbai(m.budy, users.name)
mecha.sendMessage(m.chat, {text: `${response}`}, {quoted: m, ephemeralExpiration: m.expiration, messageId: messageId});
global.db.users[m.sender].limit -= 1
} catch (error) {
mecha.sendReact(m.chat, '❌', m.key)
return errorMessage(error)
}
}
},
limit: true
}

async function Lbbai(input, name) {
try {
const today = new Date();
const date = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1; // perhatikan bahwa bulan dimulai dari 0, maka ditambahkan 1.
const year = today.getFullYear();
// mengambil nama hari dalam bahasa Inggris.
const dayOfWeek = today.toLocaleDateString("id-ID", { weekday: "long" });
const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
const getTodayDate = `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year}.`;
const sistem = `kamu Adalah Mecha, Bot WhatsApp dengan program kecerdasan buatan AI (artificial intelligence). jawab setiap pertanyaan dengan jawaban yang edukatif, jika ada yang bertanya tentang waktu kamu jawab yang berkaitan dengan ${timeNow} dan ${getTodayDate}, lawan bicaramu adalah ${name}, kamu memiliki sifat dingin dan sedikit tsundere imut, kamu dirancang dan dikembangkan oleh SuryaDev sejak tahun 2021, SuryaDev memiliki nama lengkap Jabal Surya Ngalam, berasal dari Jepara, lahir pada 21 mei 2005, dia adalah seseorang yang kreatif dan berbakat dalam menciptakan berbagai hal.`
const response = await axios.post('https://ragbot-starter.vercel.app/api/chat', {
messages: [{ role: "system", content: sistem }, { role: "user", content: input }],
useRag: true,
llm: 'gpt-3.5-turbo',
similarityMetric: 'cosine'
});
return response.data.replace("I'm sorry, I don't know the answer.", "Maaf, saya tidak mengerti apa yang kamu maksud.");
} catch (error) {
throw error;
}
}