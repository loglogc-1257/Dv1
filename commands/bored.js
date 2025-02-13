const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'bored',
  description: 'Obtenez une idée d’activité aléatoire.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://www.boredapi.com/api/activity/');
      await sendMessage(senderId, { text: `💡 **Suggestion d'activité :** ${data.activity}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de trouver une activité.' }, token);
    }
  }
};
