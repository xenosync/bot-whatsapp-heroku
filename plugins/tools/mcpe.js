const axios = require('axios')
const cheerio = require('cheerio')

async function list(page = 1) {
try {
let { data } = await axios(`https://mcpedl.org/downloading/page/${page}`)
let $ = cheerio.load(data)

let result = []
$("article.tease.tease-post > section.entry-header-category").each(function() {
let $$ = $(this)
let obj = {}
obj.thumbnail = $$.find("a.post-thumbnail > picture > img").attr("data-src")
obj.title = $$.find("h2.entry-title").text().trim()
obj.id = $$.find("h2.entry-title > a").attr("href").split("/").at(-2)
result.push(obj)
})

return result
} catch(err) {
if (err?.response?.status == 404) return {
error: true,
message: "Page Not Found"
}
throw err
}
}

async function download(id) {
try {
let { data } = await axios(`https://mcpedl.org/${id}`)
let $ = cheerio.load(data)

let __dl = (await axios("https://mcpedl.org/dw_file.php?id=" + $("#download-link > table > tbody > tr > td > a").attr("href").split("/").at(-1))).data
let _dl = cheerio.load(__dl)
let dl = _dl("a").attr("href")

let result = {}
result.url = dl
result.version = $($("#download-link > table > tbody > tr > td")[0]).text()
result.size = $($(".entry-footer > .entry-footer-wrapper > .entry-footer-column > .entry-footer-content > span").get(-1)).text()

return result
} catch(err) {
if (err?.response?.status == 404) return {
error: true,
message: "Page Not Found"
}
throw err
}
}

exports.run = {
usage: ['mcpelist', 'mcpedl'],
use: 'parameter',
category: 'tools',
async: async (m, { func, mecha }) => {
switch (m.command) {
case 'mcpelist':{
if (!m.text) return m.reply(func.example(m.cmd, '1'))
if (isNaN(m.text)) return m.reply('page harus berupa angka!')
mecha.sendReact(m.chat, '🕒', m.key)
let result = await list(m.text)
let rows = []
let body = `found ${result.length} result from page ${m.text}`
for (let [index, data] of result.entries()) {
if (!data.thumbnail && !data.title && !data.id) continue
rows.push({
header: `${index + 1}. ${data.title}`,
title: data.id,
id: `${m.prefix}mcpedl ${data.id}`,
})
}
let sections = [{
title: 'PILIH VERSI MCPE DIBAWAH',
rows: rows
}]
let buttons = [
['list', 'Click Here ⎙', sections],
]
mecha.sendButton(m.chat, `M C P E - L I S T`, body, 'select the list button below.', buttons, m, {
expiration: m.expiration
})
}
break
case 'mcpedl':{
if (!m.text) return m.reply(func.example(m.cmd, 'minecraft-pe-1-21-0-26-apk'))
try {
mecha.sendReact(m.chat, '🕒', m.key)
let result = await download(m.text)
let caption = `Version: ${result.version}\nSize: ${result.size}`
await mecha.sendMedia(m.chat, result.url, m, {
caption: caption,
expiration: m.expiration,
fileName: m.text
})
} catch (e) {
return mecha.reply(m.chat, String(e), m)
}
}
break
}
},
limit: true
}