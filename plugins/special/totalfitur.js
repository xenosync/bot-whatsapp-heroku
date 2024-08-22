exports.run = {
usage: ['totalfitur'],
hidden: ['fitur'],
category: 'special',
async: async (m, { func, mecha, plugins }) => {
let filter = Object.entries(plugins).filter(([_, v]) => v.run && v.run.usage)
let cmd = Object.fromEntries(filter)
let category = []
for (let name in cmd) {
let obj = cmd[name].run
if (!cmd) continue
if (!obj) continue
if (!obj.category) continue
if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
else {
category[obj.category] = []
category[obj.category].push(obj)
}
}
const keys = Object.keys(category).sort()
let txt = '乂  *F E A T U R E - L I S T*\n'
for (let key of keys) {
let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == key.toLowerCase())
let commands = []
cmd.map(([_, v]) => {
switch (v.run.usage.constructor.name) {
case 'Array':
v.run.usage.map(x => commands.push({
usage: x
}))
break
case 'String':
commands.push({
usage: v.run.usage
})
}
})
txt += `\n◦  ${func.ucword(key)} : ${commands.sort((a, b) => a.usage.localeCompare(b.usage)).length} feature`
}
txt += `\n\n*Total Plugins : ${Object.keys(plugins).length}*`
txt += `\n*Total Feature : ${func.totalFeature(plugins)} Commands*`
mecha.reply(m.chat, txt, m, {
expiration: m.expiration
})
}
}