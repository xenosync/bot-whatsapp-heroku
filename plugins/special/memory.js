exports.run = {
usage: ['memory'],
hidden: ['ram'],
category: 'special',
async: async (m, { func, mecha }) => {
const memoryUsed = process.env.SERVER_MEMORY !== undefined ? (process.env.SERVER_MEMORY != 0 ? process.env.SERVER_MEMORY + ' MB' : '∞') : '∞'
const txt = `${func.texted('monospace', 'Memory Information')}

${func.texted('monospace', '- Ram Used Bot:')} ${func.texted('bold', func.fileSize(process.memoryUsage().rss))}
${func.texted('monospace', '- Max Ram Server:')} ${func.texted('bold', memoryUsed)}`
mecha.reply(m.chat, txt, m)
}
}