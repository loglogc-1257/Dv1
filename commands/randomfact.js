const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'randomfact',
  description: 'Obtenez un fait intéressant aléatoire.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      await sendMessage(senderId, { text: `🤯 **Fait du jour :** ${data.text}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer un fait.' }, token);
    }
  }
};
