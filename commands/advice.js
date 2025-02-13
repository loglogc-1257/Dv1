const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'advice',
  description: 'Obtenez un conseil aléatoire.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://api.adviceslip.com/advice');
      await sendMessage(senderId, { text: `💡 **Conseil du jour :** ${data.slip.advice}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer un conseil.' }, token);
    }
  }
};
