const fetch = require('node-fetch');

exports.run = {
usage: ['asmaulhusna'],
use: '1 - 99',
category: 'islamic',
async: async (m, { func, mecha }) => {
if (isNaN(m.args[0])) return m.reply(func.example(m.cmd, '1'))
if (Number(m.args[0]) < 1) return m.reply(`Minimal 1!`)
if (Number(m.args[0]) > 99) return m.reply(`Maksimal 99!`)
let asmaulhusna = await fetch('https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/asmaulhusna.json').then(response => response.json())
let { index, latin, arabic, translation_id, translation_en } = asmaulhusna.find(v => v.index == Number(m.args[0]))
let txt = `${index}. ${latin}\n`
txt += `${arabic}\n\n`
txt += `*Artinya:* ${translation_id}`
mecha.reply(m.chat, txt, m, {expiration: m.expiration})
}
}