// `FEATURE WIKTIONARY`

const axios = require('axios');
const cheerio = require('cheerio');

async function wiktionary(query) {
try {
const url = `https://id.m.wiktionary.org/wiki/${query}`;
const response = await axios.get(url);
const $ = cheerio.load(response.data);
const title = $('#firstHeading').text().trim();
const content = $('#mw-content-text > div.mw-parser-output').find('p').map((i, el) => $(el).text().trim().replace(/<[^>]+>/g, '')).get().join('\n\n');
if (!content) {
return {
status: false,
developer: 'SuryaDev',
message: 'Artikel not found.'
}
}
return {
status: true,
developer: 'SuryaDev',
title,
content
}
} catch (error) {
return {
status: false,
developer: 'SuryaDev',
message: String(error)
}
}
}

exports.run = {
usage: ['wiktionary'],
hidden: ['wty'],
use: 'query',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'kucing'));
mecha.sendReact(m.chat, '🕒', m.key)
const result = await wiktionary(m.text);
if (!result.status) return m.reply(result.message);
let txt = `_${result.title}_`
txt += `\n\n${result.content}`
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
},
limit: true
}