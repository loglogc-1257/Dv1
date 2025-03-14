const { sendMessage } = require('../handles/sendMessage');

let duelActif = {};

module.exports = {
  name: 'duel',
  description: 'Test de rapidité pour taper "tirer".',
  usage: 'duel',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!duelActif[senderId]) {
      duelActif[senderId] = true;
      await sendMessage(senderId, { text: '🎯 Duel ! Tape "tirer" aussi vite que possible !' }, pageAccessToken);
      setTimeout(() => {
        if (duelActif[senderId]) {
          delete duelActif[senderId];
          sendMessage(senderId, { text: '⏳ Trop lent ! Duel perdu.' }, pageAccessToken);
        }
      }, 3000);
      return;
    }

    if (args[0] && args[0].toLowerCase() === 'tirer') {
      delete duelActif[senderId];
      await sendMessage(senderId, { text: '🔫 Bravo ! Tu as gagné le duel !' }, pageAccessToken);
    } else {
      await sendMessage(senderId, { text: '❌ Mauvaise réponse ! Tape "tirer".' }, pageAccessToken);
    }
  }
};
