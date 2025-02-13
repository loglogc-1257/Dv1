const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'translate',
  description: 'Traduisez un texte en une autre langue.',
  usage: 'translate [langue] [texte]',
  async execute(senderId, args) {
    if (args.length < 2) {
      return sendMessage(senderId, { text: 'Usage: translate [langue] [texte]. Exemple: translate en Bonjour' }, token);
    }

    const targetLang = args[0];
    const text = args.slice(1).join(' ');

    try {
      const { data } = await axios.post('https://libretranslate.com/translate', {
        q: text,
        source: 'auto',
        target: targetLang,
        format: 'text'
      });

      await sendMessage(senderId, { text: `🌍 **Traduction en ${targetLang}** : ${data.translatedText}` }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Erreur API de traduction.' }, token);
    }
  }
};
