exports.run = {
usage: ['lora'],
use: 'prompt',
category: 'ai',
async: async (m, { func, mecha }) => {
let [text1, text2] = m.text.split('|')
if (!text1 || !text2) {
return m.reply(`*Here is Tutorial!*\n\n*Pay attention to the following instructions!*\n[ StableDiffusion - Lora++ ]\n\nUsage: ${m.cmd} <ID>|<prompt>\nExample: ${m.cmd} 3|beautiful cat with aesthetic jellyfish, sea god theme\n\n => _ID is the number of models available in the list_\n\n_*please see the list of available models:*_\n\n*[ID] [NAME]*\n \n[1] [Donghua#01]\n[2] [YunXi - PerfectWorld]\n[3] [Sea God (Tang San) - Douluo Dalu]\n[4] [XiaoYiXian - Battle Through the Heavens]\n[5] [God of Angels (Xian Renxue) - Douluo Dalu]\n[6] [Sheng Cai'er - Throne of Seals]\n[7] [HuTao - Genshin Impact]\n[8] [TangWutong - Unrivaled Tang Sect]\n[9] [CaiLin (Medusa) - Battle Through the Heavens]\n[10] [Elaina - Majo No TabiTabi]\n[11] [Jiang Nanan - The Unrivaled Tang Sect]\n[12] [Cailin (Queen Medusa) - BTTH [ 4KUltraHD]]\n[13] [MaXiaoTao - The Unrivaled Tang Sect]\n[14] [Yor Forger - Spy x Family]\n[15] [Boboiboy Galaxy]\n[16] [Hisoka morow]\n[17] [Ling Luochen - Unrivaled Tang Sect]\n[18] [Tang Wutong - Unrivaled Tang Sect]\n[19] [Huo Yuhao - Unrivaled Tang Sect]`)
}
mecha.sendReact(m.chat, '🕒', m.key)
let imageUrl = `https://ai.xterm.codes/api/text2img/instant-lora?id=${encodeURIComponent(text1)}&prompt=${encodeURIComponent(text2)}&key=Bell409`
await mecha.sendMessage(m.chat, {
image: {
url: imageUrl
}
}, {quoted: m, ephemeralExpiration: m.expiration})
},
limit: true
}