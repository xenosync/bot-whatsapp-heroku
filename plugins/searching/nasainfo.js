const axios = require('axios');
const cheerio = require('cheerio');

async function getNasaInfo() {
try {
const response = await axios.get('https://www.nasa.gov/');
const $ = cheerio.load(response.data);
const slides = [];
$('.hds-nasa-mag-wrapper').each((index, element) => {
const title = $(element).find('h2').text().trim();
const description = $(element).find('p').text().trim();
const link = $(element).find('a.usa-button').attr('href');
const img = $(element).find('figure img').attr('src');
slides.push({ title, description, link, img });
});

return {
status: true,
creator: "siputzx",
data: slides
};
} catch (error) {
console.error(error);
return {
status: false,
message: String(error),
data: [],
}
}
}

exports.run = {
usage: ['nasagov'],
category: 'searching',
async: async (m, { func, mecha }) => {
// NASA GOV BY SURYADEV
mecha.sendReact(m.chat, '🕒', m.key)
let result = await getNasaInfo()
if (!result.status) return m.reply(result.message)
if (result.data.length == 0) return m.reply('Empty data.')
let array = result.data.splice(0, 10); // mengambil 10 gambar pertama dari array
for (let [index, data] of array.entries()) {
await func.delay(500)
mecha.sendMessage(m.chat, {
image: {
url: data.img
},
caption: `- Title: ${data.title}\n- Description: ${data.description.trim()}`
}, {quoted: m, ephemeralExpiration: m.expiration})
}
},
limit: true
}