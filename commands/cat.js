const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'cat',
  description: 'Obtenez une image aléatoire de chat.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://api.thecatapi.com/v1/images/search');
      const catImageUrl = data[0].url;

      await sendMessage(senderId, { text: `🐱 **Voici un chat mignon :**\n${catImageUrl}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer une image de chat.' }, token);
    }
  }
};
