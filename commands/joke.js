const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'joke',
  description: 'Obtenez une blague aléatoire.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=fr');
      
      const joke = data.type === 'single' ? data.joke : `${data.setup}\n\n${data.delivery}`;
      
      await sendMessage(senderId, { text: `🤣 **Blague du jour :**\n${joke}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer une blague.' }, token);
    }
  }
};
