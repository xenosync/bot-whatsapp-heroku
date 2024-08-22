exports.run = {
  usage: ['addbadword', 'delbadword'],
  use: 'badword',
  category: 'owner',
  async: async (m, { func, mecha, setting }) => {
    const words = m.text ? m.text.split(',').map(word => word.trim().toLowerCase()) : []
    if (words.length === 0) return m.reply(func.example(m.cmd, 'kontol'))

    switch (m.command) {
      case 'addbadword':
        let addedWords = []
        words.forEach(word => {
          if (!setting.toxic.includes(word)) {
            setting.toxic.push(word)
            addedWords.push(word)
          }
        })
        if (addedWords.length > 0) {
          m.reply(`*'${addedWords.join(', ')}' added successfully!*`)
        } else {
          m.reply(`*All words are already in the database.*`)
        }
        break

      case 'delbadword':
        if (setting.toxic.length < 2) return m.reply(`Sorry, you can't remove more.`)
        let removedWords = []
        words.forEach(word => {
          if (setting.toxic.includes(word)) {
            setting.toxic = setting.toxic.filter(data => data !== word)
            removedWords.push(word)
          }
        })
        if (removedWords.length > 0) {
          m.reply(`*'${removedWords.join(', ')}' has been removed.*`)
        } else {
          m.reply(`*None of the words are in the database.*`)
        }
        break
    }
  },
  owner: true
}