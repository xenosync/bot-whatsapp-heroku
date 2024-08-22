const axios = require('axios')
const FormData = require('form-data')

const webpToImage = async (buffer) => {
try {
if (!buffer) return { status: false, message: "undefined reading buffer" };
return await new Promise(async(resolve, reject) => {
const form = new FormData();
form.append("file", buffer, {
filename: Date.now() + ".webp",
contentType: "image/webp"
});
axios.post("https://api.magicstudio.com/studio/upload/file/", form, {
headers: form.getHeaders()
}).then(res => {
const url = res.data?.url;
if (!url) reject("failed while uploading image");
axios.get("https://api.magicstudio.com/studio/tools/change-format/?image_url=" + url + "&new_format=png").then(res => {
const image = res.data?.converted_image_url;
if (!image) reject("failed while converting image");
resolve({
status: true,
url: image
})
}).catch(reject)
}).catch(reject)
});
} catch (error) {
return { status: false, message: String(error) };
}
}

exports.run = {
usage: ['toimage2'],
hidden: ['toimg2'],
use: 'reply sticker',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (/webp/.test(quoted.mime)){
m.reply(global.mess.wait)
let buffer = await quoted.download()
let result = await webpToImage(buffer);
if (!result.status) return m.reply(result.message);
await mecha.sendMessage(m.chat, {
image: {
url: result.url
},
caption: 'Convert Webp To Image'
}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply(`Reply sticker nya dengan caption ${m.cmd}`)
},
limit: true
}