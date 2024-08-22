const jimp = require('jimp');

exports.run = {
usage: ['compress'],
hidden: ['compres'],
use: 'quality',
category: 'convert',
async: async (m, { func, mecha, quoted }) => {
if (!m.text) return m.reply(`Reply image with caption *Example:* ${m.prefix}compress 80%`);
if (!/^\d+%$/.test(m.text)) return m.reply(`Invalid format. *Example:* ${m.prefix}compress 80%`);
let quality = parseInt(m.text) / 100;
if (quality < 0.1 || quality > 1) return m.reply('Quality percentage should be between *10%* and *100%*');
if (!/image\/(jpe?g|png)/.test(quoted.mime)) return m.reply('Please reply to an image');
mecha.sendReact(m.chat, '🕐', m.key)
let start = new Date();
let img = await quoted.download();
let image = await jimp.read(img);
let compressedImage = await image.quality(quality * 100).getBufferAsync(jimp.MIME_JPEG);
let end = new Date();
let time = end - start;
mecha.sendMedia(m.chat, compressedImage, m, {caption: `*Fetching:* ${time} ms`});
},
limit: true
}