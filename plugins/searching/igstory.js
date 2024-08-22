const axios = require('axios');

async function igstory(username) {
return new Promise((resolve, reject) => {
let result, image_url, video_url;
let headers = {
"accept": "*/*",
"origin": "https://id.savefrom.net",
"referer": "https://id.savefrom.net/",
"user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
};
axios(`https://igs.sf-converter.com/api/profile/${username}`, {
method: 'GET',
headers
}).then(({ data }) => {
result = data.result;
axios(`https://igs.sf-converter.com/api/stories/${data.result.id}`, {
method: 'GET',
headers
}).then(({ data }) => {
let media = [];
data.result.forEach((obj) => {
obj?.image_versions2?.candidates?.forEach((candidate) => {
if (candidate.width === 1080) {
image_url = candidate.url;
}
});
obj?.video_versions?.forEach((video) => {
if (video.type === 101) {
video_url = video.url;
}
});
let newObject = {
video: video_url,
image: image_url
};
media.push(newObject);
});
resolve({
status: true,
creator: 'SuryaDev',
data: result,
media
});
}).catch(e => {
resolve({
status: false,
creator: 'SuryaDev',
message: String(e)
});
});
}).catch(e => {
resolve({
status: false,
creator: 'SuryaDev',
message: String(e)
});
});
});
}

exports.run = {
usage: ['igstory'],
hidden: ['igs'],
use: 'username',
category: 'searching',
async: async (m, { func, mecha }) => {
try {
if (!m.text) return m.reply('Mohon input username story instagram.');
mecha.sendReact(m.chat, '🕒', m.key)
let result = await igstory(m.text)
if (!result.status) return m.reply(result.message)
let data = result.data;
let caption = `- ID: ${data.id}
- Username: @${data.username}
- Private: ${data.is_private ? 'Yes' : 'No'}
- Biography: ${data.biography}
- Fullname: ${data.full_name}
- Post: ${data.edge_owner_to_timeline_media.count}
- Followers: ${data.edge_followed_by.count}
- Following: ${data.edge_follow.count}
- Signature: ${data.profile_pic_url_signature.signature}`
await mecha.sendMedia(m.chat, data.profile_pic_url, m, {
caption: caption,
expiration: m.expiration
}).then(async (quoted) => {
for (let i of result.media) {
mecha.sendMedia(m.chat, i.video ? i.video : i.image, quoted, {
caption: `Story ig from : @${data.username}`,
expiration: m.expiration
})
await func.delay(500)
}
})
} catch (error) {
console.error('Error stalking Instagram profile:', error);
mecha.reply(m.chat, 'Terjadi kesalahan saat mengambil data story Instagram. Pastikan username yang dimasukkan benar dan coba lagi.', m);
}
},
limit: true
}