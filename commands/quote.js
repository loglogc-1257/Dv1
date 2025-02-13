const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'quote',
  description: 'Obtenez une citation inspirante.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://api.quotable.io/random');
      const quote = `📜 **"${data.content}"**\n- ${data.author}`;

      await sendMessage(senderId, { text: quote }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer une citation.' }, token);
    }
  }
};
