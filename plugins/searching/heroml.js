exports.run = {
usage: ['heroml'],
use: 'nama hero',
category: 'searching',
async: async (m, { func, mecha, errorMessage }) => {
if (!m.text) return m.reply(func.example(m.cmd, 'yin'))
mecha.sendReact(m.chat, '🕒', m.key)
try {
let res = await fetch(`https://api.yanzbotz.my.id/api/cari/hero?query=${m.text.trim()}`).then(data => data.json())
if (res.status != 200) return m.reply(global.mess.error.api)
let story = res.result.story_info_list;
let gameplay = res.result.gameplay_info;
let txt = `乂  *HERO MOBILE LEGENDS*\n\n`
txt += `	◦	*Release* : ${res.result.release}\n`
txt += `	◦	*Role* : ${res.result.role}\n`
txt += `	◦	*Specialty* : ${res.result.specialty}\n`
txt += `	◦	*Lane* : ${res.result.lane}\n`
txt += `	◦	*Price* : ${res.result.price}\n`
txt += '\n*GAMEPLAY INFO*\n'
for (let key in gameplay) txt += `	◦	*${func.ucword(key.replace('_', '\t'))}* : ${gameplay[key]}\n`
txt += '\n*STORY INFO*\n'
if (story.skill_resource) txt += `	◦	*Skill Resource* : ${story.skill_resource}\n`
if (story.damage_type) txt += `	◦	*Damage Type* : ${story.damage_type}\n`
if (story.basic_attack_type) txt += `	◦	*Basic Attack Type* : ${story.basic_attack_type}\n`
if (story.durability) txt += `	◦	*Durability* : ${story.durability}\n`
if (story.offense) txt += `	◦	*Offense* : ${story.offense}\n`
if (story.control_effects) txt += `	◦	*Control Effects* : ${story.control_effects}\n`
if (story.difficulty) txt += `	◦	*Difficulty* : ${story.difficulty}\n`
if (story.alias) txt += `	◦	*Alias* : ${story.alias}\n`
if (story.born) txt += `	◦	*Born* : ${story.born}\n`
if (story.gender) txt += `	◦	*Gender* : ${story.gender}\n`
if (story.species) txt += `	◦	*Species* : ${story.species}\n`
if (story.weapons) txt += `	◦	*Weapons* : ${story.weapons}\n`
if (story.abilities) txt += `	◦	*Abilities* : ${story.abilities}\n`
if (res.result.desc) txt += `	◦	*Desc* : ${res.result.desc}\n`
mecha.sendMedia(m.chat, res.result.hero_img, m, {caption: txt, expiration: m.expiration})
} catch (e) {
m.reply(`Data hero *${m.text.trim()}* tidak ditemukan.`)
return errorMessage(e)
}
},
limit: true
}