const fetch = require('node-fetch');

exports.run = {
usage: ['doaharian'],
hidden: ['dh'],
use: '1 - 35',
category: 'islamic',
async: async (m, { func, mecha }) => {
let doaharian = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/doaharian.json').then(response => response.json())
if (!m.text || isNaN(m.args[0]) || Number(m.args[0]) < 1 || Number(m.args[0]) > doaharian.length) {
let rows = []
for (let i of doaharian) {
rows.push({
title: `${i.index}. ${i.title}`, 
id: `${m.prefix}doaharian ${i.index}`
})
}
let sections = [{
title: 'PILIH DOA HARIAN DIBAWAH',
rows: rows
}]
let buttons = [
['list', 'Click Here ⎙', sections],
]
mecha.sendButton(m.chat, `D O A - H A R I A N`, '', 'Select the list button below.', buttons, m, {
expiration: m.expiration
})
} else {
let doaharian = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/doaharian.json').then(response => response.json())
let { index, title, arabic, latin, translation } = doaharian.find(v => v.index == Number(m.args[0]))
let txt = `No. ${index}\n\n`
txt += `${title}\n`
txt += `${arabic}\n`
txt += `${latin}\n\n`
txt += `*Artinya:* ${translation}`
mecha.reply(m.chat, txt, m, {expiration: m.expiration})
}
}
}