exports.run = {
  usage: ['voice'],
  use: 'jenis voice | text',
  category: 'ai',
  async: async (m, { mecha }) => {
    if (!m.text) return m.reply(`Halo?`);
    const voices = ['bella', 'echilling', 'adam', 'prabowo', 'thomas_shelby', 'michi_jkt48', 'jokowi', 'nokotan', 'boboiboy'];
    const [voice, ...textArray] = m.text.split(' | ');
    const text = textArray.join(' ');
    if (!voice || !text || !voices.includes(voice.toLowerCase())) {
      return m.reply(`Voice tidak valid! Tersedia:\n\n${voices.join('\n')}`);
    }
    mecha.sendMessage(m.chat, { audio: { url: `https://ai.xterm.codes/api/text2speech/elevenlabs?text=${encodeURIComponent(text)}&key=Bell409&voice=${voice}` }, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
  },
  limit: true
};