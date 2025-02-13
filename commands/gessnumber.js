const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'guessnumber',
  description: 'Devinez un nombre entre 1 et 10.',
  async execute(senderId) {
    const randomNumber = Math.floor(Math.random() * 10) + 1;

    await sendMessage(senderId, { text: "🎲 J’ai choisi un nombre entre 1 et 10. Devinez lequel !" }, token);

    // Attente de la réponse (simulé ici)
    setTimeout(async () => {
      await sendMessage(senderId, { text: `🔢 Réponse : ${randomNumber}` }, token);
    }, 5000);
  }
};
