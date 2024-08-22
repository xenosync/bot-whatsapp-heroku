exports.run = {
usage: ['calculator'],
hidden: ['kalculator', 'kalk', 'calk'],
use: 'text',
category: 'tools',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, '1 + 1'))
let val = m.text
.replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
.replace(/×/g, '*')
.replace(/÷/g, '/')
.replace(/π|pi/gi, 'Math.PI')
.replace(/e/gi, 'Math.E')
.replace(/\/+/g, '/')
.replace(/\++/g, '+')
.replace(/-+/g, '-')
let format = val
.replace(/Math\.PI/g, 'π')
.replace(/Math\.E/g, 'e')
.replace(/\//g, '÷')
.replace(/\*×/g, '×')
try {
console.log(val)
let result = (new Function('return ' + val))()
if (!result) return m.reply(result)
m.reply(`*${format}* = ${result}`)
} catch (e) {
if (e == undefined) return m.reply('Isinya?')
m.reply('Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
}
},
limit: true
}