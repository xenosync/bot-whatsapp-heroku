exports.run = {
usage: ['ytsearch'],
hidden: ['yts'],
use: 'judul lagu',
category: 'downloader',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'legends never die'))
mecha.sendReact(m.chat, '🕒', m.key)
let data = await func.fetchJson('https://suryadev.vercel.app/api/yts?query=' + encodeURI(m.text));
if (!data.status) return m.reply(data.message)
if (data.result.length == 0) return m.reply('Data empty.')
let txt = `*Y O U T U B E - S E A R C H*\n\nResult From : ${m.text}\n\nSelect the list button below.`
let listSearch = [];
for (let i of data.result) {
listSearch.push({
title: i?.title || 'N/A', 
highlight_label: i.channel || 'N/A',
rows: [
{
header: 'Audio',
title: `${i.publish} • ${i.duration.timestamp} • ${func.formatNumber(i.views)} views`, 
id: `${m.prefix}yta ${i.url}`, 
description: `${i.description}`
},
{
header: 'Video',
title: `${i.publish} • ${i.duration.timestamp} • ${func.formatNumber(i.views)} views`, 
id: `${m.prefix}ytv ${i.url}`, 
description: `${i.description}`
}
]
})
}
let buttons = [
['list', 'Click Here ⎙', listSearch]
]
mecha.sendButton(m.chat, `Y O U T U B E - S E A R C H`, `Result From : ${m.text}\n\nSelect the list button below.`, global.footer, buttons, m, {
expiration: m.expiration
})
},
limit: true
}