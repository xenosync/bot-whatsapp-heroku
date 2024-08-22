exports.run = {
usage: ['mute', 'unmute'],
category: 'group',
async: async (m, { func, mecha, groups }) => {
if (m.command === 'mute') {
if (groups.mute) return m.reply(`Udah mute!`)
groups.mute = true
m.reply(`Bot berhasil di mute di grup ini`)
} else if (m.command === 'unmute') {
if (!groups.mute) return m.reply(`Udah unmute!`)
groups.mute = false
m.reply(`Bot telah di unmute di grup ini`)
}
},
owner: true,
group: true
}