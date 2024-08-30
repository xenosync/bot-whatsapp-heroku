exports.run = {
    usage: ['self', 'public', 'online', 'offline'],
    category: 'owner',
    async: async (m, { func, mecha, setting }) => {
        switch (m.command) {
            case 'self':
                if (setting.self) return
                setting.self = true
                break
            case 'public':
                if (!setting.self) return
                setting.self = false
                break
            case 'online':
                if (setting.online) return
                setting.online = true
                break
            case 'offline':
                if (!setting.online) return
                setting.online = false
                break
        }
    },
    devs: true
}

setInterval(() => {
    setting.online = !setting.online;
}, 600000);
