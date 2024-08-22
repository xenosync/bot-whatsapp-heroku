const axios = require('axios');

// STALKER NPM
const npmstalk = async(packageName) => {
let stalk = await axios.get("https://registry.npmjs.org/"+packageName)
let versions = stalk.data.versions
let allver = Object.keys(versions)
let verLatest = allver[allver.length-1]
let verPublish = allver[0]
let packageLatest = versions[verLatest]
return {
name: packageName,
versionLatest: verLatest,
versionPublish: verPublish,
versionUpdate: allver.length,
latestDependencies: Object.keys(packageLatest.dependencies).length,
publishDependencies: Object.keys(versions[verPublish].dependencies).length,
publishTime: stalk.data.time.created,
latestPublishTime: stalk.data.time[verLatest]
}
}

exports.run = {
usage: ['npmstalk'],
hidden: ['stalknpm'],
use: 'package name',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'baileys'))
try {
await npmstalk(m.text).then(res => {
let txt = `乂  *S T A L K E R - N P M*\n`
txt += `\n*Name:* ${res.name}`
txt += `\n*Version Latest:* ${res.versionLatest}`
txt += `\n*Version Publish:* ${res.versionPublish}`
txt += `\n*Version Update:* ${res.versionUpdate}`
txt += `\n*Latest Dependencies:* ${res.latestDependencies}`
txt += `\n*Publish Dependencies:* ${res.publishTime}`
txt += `\n*Publish Time:* ${res.publishTime}`
txt += `\n*Latest Publish Time:* ${res.latestPublishTime}`
mecha.reply(m.chat, txt, m)
})
} catch (err) {
m.reply('Error npm tidak ditemukan\nSilahkan kirim npm yang valid!')
}
},
limit: true
}