const { sendMessage } = require('../handles/sendMessage');

const positions = ['A1', 'B2', 'C3', 'D4', 'E5']; // Positions possibles

module.exports = {
  name: 'bataille',
  description: 'Joue à la bataille navale.',
  usage: 'bataille [A1-E5]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Donne une position (ex: A1, B2, etc.)' }, pageAccessToken);
      return;
    }

    const tir = args[0].toUpperCase();
    if (positions.includes(tir)) {
      await sendMessage(senderId, { text: `🎯 Touché ! Le bateau était à ${tir} !` }, pageAccessToken);
    } else {
      await sendMessage(senderId, { text: `💦 Raté ! ${tir} ne contenait pas de bateau.` }, pageAccessToken);
    }
  }
};
