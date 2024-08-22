const fetch = require('node-fetch')

exports.run = {
usage: ['status'],
category: 'special',
async: async (m, { func, mecha }) => {
fetch(`http://ip-api.com/line`)
.then(res => res.text())
.then(txt => m.reply(txt))
}
}