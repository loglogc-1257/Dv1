const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'shorten',
  description: 'Raccourcissez une URL.',
  usage: 'shorten [URL]',
  async execute(senderId, args) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Usage: shorten [URL]. Exemple: shorten https://google.com' }, token);
    }

    const url = args[0];
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      await sendMessage(senderId, { text: `🔗 **URL raccourcie** : ${data}` }, token);
    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Erreur API TinyURL.' }, token);
    }
  }
};
