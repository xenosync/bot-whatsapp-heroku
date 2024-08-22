const FormData = require('form-data');
const jimp = require('jimp');
const axios = require('axios');

async function upscale(buffer, size = 2, anime = false) {
  if (!buffer || !Buffer.isBuffer(buffer)) throw new Error("Invalid buffer input");
  if (!/(2|4|6|8|16)/.test(size.toString())) throw new Error("Invalid upscale size");
  const image = await jimp.read(buffer);
  const { width, height } = image.bitmap;
  const newWidth = width * size;
  const newHeight = height * size;
  const form = new FormData();
  form.append("name", "upscale-" + Date.now());
  form.append("imageName", "upscale-" + Date.now());
  form.append("desiredHeight", newHeight.toString());
  form.append("desiredWidth", newWidth.toString());
  form.append("outputFormat", "png");
  form.append("compressionLevel", "none");
  form.append("anime", anime.toString());
  form.append("image_file", buffer, {
    filename: "upscale-" + Date.now() + ".png",
    contentType: 'image/png',
  });
  try {
    const res = await axios.post("https://api.upscalepics.com/upscale-to-size", form, {
      headers: {
        ...form.getHeaders(),
        origin: "https://upscalepics.com",
        referer: "https://upscalepics.com"
      }
    });

    const data = res.data;
    if (data.error) throw new Error("Error from upscaler API");
    return { status: true, image: data.bgRemoved };
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.run = {
  usage: ['upscale'],
  hidden: ['hd'],
  use: 'reply photo with upscale factor',
  category: 'ai',
  async: async (m, { func, mecha, quoted }) => {
    if (/image\/(jpe?g|png)/.test(quoted.mime)) {
      mecha.sendReact(m.chat, '🕒', m.key);
      try {
        const media = await quoted.download();
        const size = 16;
        const result = await upscale(media, size);
        const jsonResponse = {
          status: "success",
          image: result.image,
          message: "Created by https://github.com/ztrdiamond"
        };
        mecha.sendMessage(m.chat, { text: JSON.stringify(jsonResponse, null, 2) }, { quoted: m });
      } catch (error) {
        m.reply(`Error: ${error.message}`);
      }
    } else {
      m.reply(`Reply gambar dengan caption ${m.cmd}`);
    }
  },
  premium: true,
  limit: true
};