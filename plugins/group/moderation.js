exports.run = {
  usage: ['welcome', 'left', 'detect', 'antitoxic', 'antilink', 'antivirtex', 'antibot', 'antiluar', 'antiviewonce', 'antihidetag', 'antidelete', 'antiedited', 'automatically'],
  use: 'on / off',
  category: 'admin tools',
  async: async (m, { func, mecha, groups }) => {
    let setting = global.db.groups[m.chat];
    if (!m.isBotAdmin && /antitoxic|antilink|antivirtex|antibot|antiluar|antihidetag|automatically/.test(m.command)) return await mecha.sendReact(m.chat, '❌', m.key);
    if (!m.args || !m.args[0]) return await mecha.sendReact(m.chat, '❓', m.key);
    let option = m.args[0].toLowerCase();
    let optionList = ['on', 'off'];
    if (!optionList.includes(option)) return await mecha.sendReact(m.chat, '❓', m.key);
    let status = option === 'on' ? true : false;
    if (setting[m.command] == status) return await mecha.sendReact(m.chat, '⚠️', m.key);
    setting[m.command] = status;
    await mecha.sendReact(m.chat, '✅', m.key);
  },
  admin: true,
  group: true
}