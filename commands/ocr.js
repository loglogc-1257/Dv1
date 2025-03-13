const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ocr',
  description: "Extrait le texte d'une image",
  usage: 'ocr [image_url]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir l’URL d’une image.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ocr https://example.com/image.jpg'
      }, pageAccessToken);
      return;
    }

    const imageUrl = args[0];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/ocr?url=${encodeURIComponent(imageUrl)}`;

    await sendMessage(senderId, { text: '♻️ Extraction du texte en cours...' }, pageAccessToken);

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `📜 Texte extrait :\n${data.text}` }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API OCR:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de l’extraction du texte." }, pageAccessToken);
    }
  }
};
