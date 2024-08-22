const fetch = require('node-fetch');

// Penyimpanan memori untuk prompt sebelumnya
let memory = {};

const validStyles = [
  "no_style", "barbie", "baby", "magic", "game", "anime", "super_heroes", "fantasy", 
  "painting", "gothic", "cyberpunk", "cartoon", "pencil_sketch", "dream", "animation", 
  "cinematic", "sunset", "photo", "van_gogh", "mythological", "botticelli", "epic", 
  "realistic", "studio", "underwater", "mystical", "rainbow", "winter", "neon", 
  "magazine", "rich", "3d_render", "scifi", "steampunk", "no_colour", "da_vinci", 
  "retrofuturizm", "the_city", "tattoo", "apocalypse", "salvador_dal", "jungle", 
  "90s", "pandora", "pixel_art", "vampire", "fire", "devil", "zombie", "ice", 
  "bestie", "summer"
];

exports.run = {
  usage: ['diffusion2'],
  hidden: ['df2'],
  use: 'style | prompt',
  category: 'ai',
  async: async (m, { func, mecha, quoted }) => {
    let style = "no_style";
    let text;
    let negative = "not hd, watermark";
    const args = m.args.join(" ").split('|').map(arg => arg.trim());

    if (args.length === 2) {
      style = args[0];
      text = args[1];
    } else if (args.length === 1) {
      text = args[0];
    } else if (memory[m.chat]) {
      // Gunakan prompt dari memori jika tidak ada input dari pengguna
      text = memory[m.chat];
    } else if (m.quoted && m.quoted.text) {
      text = m.quoted.text;
    } else {
      return m.reply(func.example(m.cmd, 'barbie | halo'));
    }

    if (validStyles.includes(style) || style === "no_style") {
      mecha.sendReact(m.chat, '🕒', m.key);
      
      try {
        let res = await stableDiff(text, negative, style);
        if (!res.result || !res.result.images || res.result.images.length === 0) {
          return m.reply("No images generated.");
        }

        // Simpan prompt ke dalam memori
        memory[m.chat] = text;

        await mecha.sendMedia(m.chat, res.result.images[0], null, {
          expiration: m.expiration
        });
        mecha.sendReact(m.chat, '✅', m.key);
      } catch (error) {
        return m.reply(String(error));
      }
    } else {
      return m.reply(`Invalid style. Available styles: ${validStyles.join(", ")}`);
    }
  },
  premium: true
};

async function stableDiff(prompt, negative, style) {
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
          style: style
        })
      }).then((v) => v.json());

      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}