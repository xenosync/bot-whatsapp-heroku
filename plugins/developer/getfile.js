const path = require('path')
const fs = require('fs')

exports.run = {
usage: ['getfile'],
hidden: ['gf'],
use: 'path file',
category: 'owner',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'config.js'))
let fileName = m.text.trim().toLowerCase()
let filePath = path.join(process.cwd(), fileName)
if (!fs.existsSync(filePath)) {
return m.reply(`File ${fileName}.js does not exist!`)
}
let fileContent = fs.readFileSync(filePath, 'utf-8')
m.reply(fileContent)
},
devs: true
}