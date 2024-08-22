const axios = require('axios');

exports.run = {
usage: ['copilot'],
hidden: ['cp'],
use: 'text',
category: 'ai',
async: async (m, { func, mecha, users }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'apa itu coding'));
try {
let wait = await mecha.sendMessage(m.chat, {text: global.mess.wait}, {quoted: m, ephemeralExpiration: m.expiration});
let response = await copilotAi(m.text + " dan namaku adalah " + users.name);
await mecha.sendMessage(m.chat, {text: response, edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
} catch (e) {
await mecha.sendMessage(m.chat, {text: e.toString(), edit: wait.key}, {quoted: m, ephemeralExpiration: m.expiration});
}
},
limit: 3
};

/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @param {String} prompt
 * @param { String} system
 * @description Any Request? Contact me : vielynian@gmail.com
 * @author Kaviaann 2024
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
async function copilotAi(prompt) {
return new Promise(async (resolve, reject) => {
try {
const system = "Kamu adalah Copilot, sebuah asisten virtual yang bertugas untuk membantu menyelesaikan permasalahan yang diberikan. Sekarang " + `detik ${new Date().getSeconds()}, menit ${new Date().getMinutes()}, jam ${new Date().getHours()}, tanggal ${new Date().getDate()}, hari ke ${new Date().getDay()}, bulan ke ${new Date().getMonth()}, dan tahun ${new Date().getFullYear()}` + ". Kamu akan menjawab dalam bahasa Indonesia, dan juga kamu dapat menggunakan * untuk teks bold, _ untuk teks italic, dan ` untuk teks code, gunakan [nama websitenya] untuk website. Contohnya: *PERHATIAN!* Saya adalah _Copilot_ dan saya bisa membantu menyelesaikan `permasalahan anda`"
const BASE_URL = "https://omniplex.ai/api";
const headers = {
origin: BASE_URL.replace("/api", ""),
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
"Content-Type": "application/json",
};
const chatJSON = {
frequency_penalty: 0,
max_tokens: 512,
messages: [
{
role: "system",
content: system,
},
{
role: "user",
content: prompt,
},
],
model: "gpt-3.5-turbo",
presence_penalty: 0,
temperature: 1,
top_p: 1,
};

// Determine which mode
const { mode, arg } = await fetch(BASE_URL + "/tools", {
method: "POST",
headers,
body: JSON.stringify(chatJSON.messages),
}).then((v) => v.json());

// Run by mode type
switch (mode) {
case "search": {
const a = await searchMode();
if (!a[0]) reject("Search mode failed with error : \n" + (a[1] || a));
return resolve(a[0]);
}

case "chat": {
const b = await chat();
if (!b[0]) reject("Chat mode failed with error : \n" + (b[1] || b));
return resolve(b);
}
}

// Handler
async function chat() {
return new Promise(async (s, r) => {
try {
const a = await fetch(BASE_URL + "/chat", {
method: "POST",
headers,
body: JSON.stringify(chatJSON),
}).then((v) => v.text());

if (!a) return r([false, "Failed to get result"]);
s(a);
} catch (e) {
r(e);
}
});
}

async function searchMode() {
return new Promise(async (s, r) => {
try {
const a = await fetch(
BASE_URL +
"/search?" +
new URLSearchParams({
q: "search " + prompt,
limit: 5,
})
).then((v) => v.json());
if (a.message !== "Success") return r([false, "Failed to search"]);
const b = a.data.webPages.value.map((v) => v.url);
const c = await fetch(
BASE_URL +
"/scrape?" +
new URLSearchParams({
urls: b.join(","),
}),
{
method: "POST",
headers,
}
).then((v) => v.text());
chatJSON.messages[1].content = c + "\n\nQuestion : " + prompt;
chatJSON.messages[0].content = `Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided web Search Results (URL and Summary).You must only use information from the provided search results.Use an unbiased and journalistic tone.Use this current date and time: ${new Date().toUTCString()}.Combine search results together into a coherent answer.Do not repeat text.Only cite the most relevant results that answer the question accurately.If different results refer to different entities with the same name, write separate answers for each entity.You have the ability to search and will be given websites and the scraped data from them and you will have to make up an answer with that only. ${system}`;
const d = await fetch(BASE_URL + "/chat", {
method: "POST",
headers,
body: JSON.stringify(chatJSON),
}).then((v) => v.text());
s([d, a.data]);
} catch (e) {
r(e);
}
});
}
} catch (e) {
reject(e.toString());
}
});
}