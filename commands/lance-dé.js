const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'lance-dé',
  description: "Lance un dé à 6 faces.",
  usage: 'lance-dé',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    const resultat = Math.floor(Math.random() * 6) + 1;
    await sendMessage(senderId, { text: `🎲 Résultat : ${resultat}` }, pageAccessToken);
  }
};
