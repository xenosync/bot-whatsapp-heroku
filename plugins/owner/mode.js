exports.run = {
    usage: ['self', 'public', 'online', 'offline'],
    category: 'owner',
    async: async (m, { func, mecha, setting }) => {
        switch (m.command) {
            case 'self':
                if (setting.self) return m.reply('Already in self mode.')
                setting.self = true
                m.reply('Successfully changed to self')
                break
            case 'public':
                if (!setting.self) return m.reply('Already in public mode.')
                setting.self = false
                m.reply('Successfully changed to public')
                break
            case 'online':
                if (setting.online) return m.reply('Already in online mode.')
                setting.online = true
                m.reply('Successfully changed to online')
                break
            case 'offline':
                if (!setting.online) return m.reply('Already in offline mode.')
                setting.online = false
                m.reply('Successfully changed to offline')
                break
        }
    },
    devs: true
}