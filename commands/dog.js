const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'dog',
  description: 'Obtenez une image aléatoire de chien.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      await sendMessage(senderId, { text: `🐶 **Voici un chien mignon :**\n${data.message}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer une image de chien.' }, token);
    }
  }
};
