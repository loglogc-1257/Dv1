const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'define',
  description: 'Obtenez la définition d’un mot.',
  usage: 'define [mot]',
  async execute(senderId, args) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Usage: define [mot]. Exemple: define ordinateur' }, token);
    }

    const word = args[0];

    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      const definition = data[0]?.meanings[0]?.definitions[0]?.definition;
      if (!definition) {
        return sendMessage(senderId, { text: '❌ Définition introuvable.' }, token);
      }

      await sendMessage(senderId, { text: `📖 **Définition de "${word}"** :\n${definition}` }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Erreur API dictionnaire.' }, token);
    }
  }
};
