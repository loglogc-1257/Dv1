const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'meme',
  description: 'Obtenez un mème aléatoire.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme');
      await sendMessage(senderId, { text: `🤣 **Mème du jour :**\n${data.url}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer un mème.' }, token);
    }
  }
};
