const axios = require('axios')
const FormData = require('form-data')

const api = axios.create({ baseURL: 'https://aivocalremover.com' })
const getKey = async () => (await api.get('/')).data.match(/key:"(\w+)/)[1]

const vocalRemover = async (audioBuffer) => {
const form = new FormData()
const fileName = Math.random().toString(36) + '.mpeg'
form.append('fileName', audioBuffer, fileName)

const [key, fileUpload] = await Promise.all([
await getKey(),
await api.post('/api/v2/FileUpload', form, { headers: form.getHeaders() }).catch(e => e.response)
])
if (fileUpload.status !== 200) throw fileUpload.data || fileUpload.statusText

const processFile = await api.post('/api/v2/ProcessFile', new URLSearchParams({
file_name: fileUpload.data.file_name,
action: 'watermark_video', key, web: 'web' 
})).catch(e => e.response)

return processFile.data
}

exports.run = {
usage: ['aivocalremover'],
hidden: ['vocalremover', 'avr'],
use: 'reply audio',
category: 'ai',
async: async (m, { func, mecha, quoted }) => {
if (m.text && /instrumental|vocal/.test(m.args[0])) {
mecha.sendReact(m.chat, '🕒', m.key)
await mecha.sendMedia(m.chat, m.args[1], m, { expiration: m.expiration })
return
}
if (/audio/.test(quoted.mime)) {
mecha.sendReact(m.chat, '🕒', m.key)
let media = await quoted.download()
let result = await vocalRemover(media)
if (result.error) return m.reply(result.message)
let button = [
['button', 'Get Vocal', `${m.prefix}vocalremover vocal ${result.vocal_path}`],
['button', 'Get Instrumental', `${m.prefix}vocalremover instrumental_path ${result.instrumental_path}`],
]
mecha.sendButton(m.chat, '', result.message, 'please select the button below.', button, m, {
userJid: m.sender,
expiration: m.expiration
})
} else m.reply(`Reply audio dengan caption ${m.cmd}`)
},
premium: true
}