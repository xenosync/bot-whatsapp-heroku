exports.run = {
usage: ['runtime'],
hidden: ['test'],
category: 'special',
async: async (m, { func, mecha, setting, fkon }) => {
mecha.sendMessageModify(m.chat, `Quick Test Done! ${m.pushname}`, fkon, {
title: 'Aktif Selama :',
body: func.runtime(process.uptime()),
thumbUrl: setting.cover,
largeThumb: false,
url: null,
expiration: m.expiration
})
}
}