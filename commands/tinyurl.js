const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tinyurl',
  description: "Réduit une URL avec TinyURL",
  usage: 'tinyurl [url]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une URL à raccourcir.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: tinyurl https://example.com'
      }, pageAccessToken);
      return;
    }

    const url = args[0];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/tinyurl?upload=${encodeURIComponent(url)}`;

    await sendMessage(senderId, { text: '♻️ Raccourcissement en cours...' }, pageAccessToken);

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔗 URL raccourcie : ${data.short_url}` }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API TinyURL:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de la réduction de l’URL." }, pageAccessToken);
    }
  }
};
