const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

async function tmpfiles(buffer) {
  const { ext, mime } = (await fromBuffer(buffer)) || {};
  const form = new FormData();
  form.append("file", buffer, { filename: `tmp.${ext}`, contentType: mime });
  const { data } = await axios.post("https://tmpfiles.org/api/v1/upload", form, { headers: form.getHeaders() });
  return `https://tmpfiles.org/dl/${/https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url)[1]}`;
}

exports.run = {
  usage: ['stickermeme'],
  hidden: ['smeme'],
  use: 'text atas | bawah',
  category: 'convert',
  async: async (m, { func, mecha, quoted, packname, author }) => {
    let [atas, bawah] = m.text.includes('|') ? m.text.split('|').map(v => v.trim()) : [m.text, ''];
    if (!m.text) return m.reply(func.example(m.cmd, 'beliau | awikawok'));
    if (m.text.length > 75) return m.reply('Textnya kepanjangan.');
    if (/image\/(jpe?g|png|webp)/.test(quoted.mime)) {
      if (/webp/.test(quoted.mime) && m.quoted.isAnimated) return m.reply('Not support gif stickers.');
      mecha.sendReact(m.chat, '🕒', m.key);
      let meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${await tmpfiles(await quoted.download())}`;
      mecha.sendSticker(m.chat, meme_url, m, { packname, author, expiration: m.expiration });
    } else m.reply(`Kirim/Reply gambar dengan caption ${m.cmd} text atas | text bawah`);
  },
  restrict: true,
  limit: 5
}