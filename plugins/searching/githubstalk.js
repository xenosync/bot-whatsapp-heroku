const axios = require('axios');

// STALKER GITHUB
const githubstalk = async(user) => {
return new Promise((resolve, reject) => {
axios.get('https://api.github.com/users/'+user)
.then(({ data }) => {
let hasil = {
username: data.login,
nickname: data.name,
bio: data.bio,
id: data.id,
nodeId: data.node_id,
profile_pic: data.avatar_url,
url: data.html_url,
type: data.type,
admin: data.site_admin,
company: data.company,
blog: data.blog,
location: data.location,
email: data.email,
public_repo: data.public_repos,
public_gists: data.public_gists,
followers: data.followers,
following: data.following,
ceated_at: data.created_at,
updated_at: data.updated_at
}
resolve(hasil)
})
})
}

exports.run = {
usage: ['githubstalk'],
hidden: ['stalkgithub'],
use: 'username',
category: 'searching',
async: async (m, { func, mecha }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'Jabalsurya2105'))
mecha.sendReact(m.chat, '🕒', m.key)
try {
await githubstalk(m.text).then(res => {
let txt = '乂  *S T A L K E R - G I T H U B*\n'
txt += `\n*Username:* ${res.username}`
txt += `\n*Nickname:* ${res.nickname}`
txt += `\n*Bio:* ${res.bio}`
txt += `\n*ID:* ${res.id}`
txt += `\n*NodeId:* ${res.nodeId}`
txt += `\n*Url:* ${res.url}`
txt += `\n*Type:* ${res.type}`
txt += `\n*Admin:* ${res.admin ? 'Yes' : 'No'}`
txt += `\n*Company:* ${res.company}`
txt += `\n*Blog:* ${res.blog}`
txt += `\n*Location:* ${res.location}`
txt += `\n*Email:* ${res.email ?? 'Nothing'}`
txt += `\n*Public Repo:* ${res.public_repo}`
txt += `\n*Public Gists:* ${res.public_gists}`
txt += `\n*Followers:* ${res.followers}`
txt += `\n*Following:* ${res.following}`
txt += `\n*Ceated At:* ${res.ceated_at}`
txt += `\n*Updated At:* ${res.updated_at}`
mecha.sendMessage(m.chat, {image: {url : res.profile_pic}, caption: txt}, {quoted: m, ephemeralExpiration: m.expiration})
})
} catch (err) {
m.reply('Error Username tidak ditemukan\nSilahkan kirim Username yang valid!')
}
},
limit: true
}