const { sendMessage } = require('../handles/sendMessage');

const targetNumbers = {};

module.exports = {
  name: 'devine',
  description: "Devine le nombre choisi par le bot.",
  usage: 'devine [nombre]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!targetNumbers[senderId]) {
      targetNumbers[senderId] = Math.floor(Math.random() * 100) + 1;
    }

    const guess = parseInt(args[0], 10);

    if (isNaN(guess)) {
      await sendMessage(senderId, { text: "❌ Veuillez entrer un nombre valide." }, pageAccessToken);
      return;
    }

    if (guess < targetNumbers[senderId]) {
      await sendMessage(senderId, { text: "🔽 Trop petit !" }, pageAccessToken);
    } else if (guess > targetNumbers[senderId]) {
      await sendMessage(senderId, { text: "🔼 Trop grand !" }, pageAccessToken);
    } else {
      await sendMessage(senderId, { text: "🎉 Bravo ! Tu as trouvé le nombre !" }, pageAccessToken);
      delete targetNumbers[senderId];
    }
  }
};
