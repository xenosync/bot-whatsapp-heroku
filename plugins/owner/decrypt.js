exports.run = {
  usage: ['decrypt'],
  use: 'decrypt',
  category: 'owner',
  async: async (m, { func, mecha, setting }) => {
    const code = m.text.trim()
    if (!code) return m.reply(func.example(m.cmd, 'var _0x5377=["Hello World!"]; var a=_0x5377[0]; function MsgBox(_0x82a8x3){alert(_0x82a8x3);} MsgBox(a);'))

    try {
      const response = await fetch(`https://api.alyachan.dev/api/deobfuscator?code=${encodeURIComponent(code)}&apikey=YOUR_API_KEY`)
      const result = await response.json()

      if (result.status) {
        m.reply(`Decrypted Code:\n\n${result.data.results}`)
      } else {
        m.reply('Failed to decrypt the code. Please check your input and try again.')
      }
    } catch (error) {
      m.reply('An error occurred while trying to decrypt the code.')
    }
  },
  owner: true
}