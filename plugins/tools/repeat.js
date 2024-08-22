function repeat(text){
let txt = `${text}\t`
return txt.repeat(1000)
}

function repeat2(text){
let txt = `${text}\n`
return txt.repeat(1000)
}

exports.run = {
usage: ['repeat', 'repeat2'],
use: 'text',
category: 'tools',
async: async (m, { func, mecha }) => {
switch (m.command) {
case 'repeat':
if (!m.text) return m.reply(func.example(m.cmd, 'astaghfirullah'))
mecha.sendReact(m.chat, '🕒', m.key)
mecha.reply(m.chat, repeat(m.text), m)
break
case 'repeat2':
if (!m.text) return m.reply(func.example(m.cmd, 'astaghfirullah'))
mecha.sendReact(m.chat, '🕒', m.key)
mecha.reply(m.chat, repeat2(m.text), m)
break
}
},
premium: true
}