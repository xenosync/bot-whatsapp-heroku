const fetch = require('node-fetch');

exports.run = {
  usage: ['animegen'],
  hidden: [''],
  use: 'prompt',
  category: 'ai',
  async: async (m, { func, mecha, quoted }) => {
    let text;
    let negative = "not hd, watermark";
    if (m.args.length >= 1) {
      text = m.args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
      text = m.quoted.text;
    } else return m.reply(func.example(m.cmd, 'halo'));
    
    mecha.sendReact(m.chat, '🕒', m.key);
    
    try {
      let res = await stableDiff(text, negative);
      if (!res.result || !res.result.images || res.result.images.length === 0) return m.reply("No images generated.");
      await mecha.sendMedia(m.chat, res.result.images[0], null, {
        expiration: m.expiration
      });
      mecha.sendReact(m.chat, '✅', m.key);
    } catch (error) {
      return m.reply(String(error));
    }
  },
  premium: true
};

async function stableDiff(prompt, negative) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch('https://api.itsrose.rest/image/stable/diffusion', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': 'Rk-620098cf43375ac5ae53e52f6085076b',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: negative,
          style: "anime"
        })
      }).then((v) => v.json());

      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}