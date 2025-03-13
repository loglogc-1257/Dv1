const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'imgur',
  description: "Upload une image sur Imgur",
  usage: 'imgur [image_url]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir l’URL d’une image.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: imgur https://example.com/image.jpg'
      }, pageAccessToken);
      return;
    }

    const imageUrl = args[0];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/imgur?url=${encodeURIComponent(imageUrl)}`;

    await sendMessage(senderId, { text: '♻️ Upload en cours...' }, pageAccessToken);

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `✅ Image uploadée : ${data.url}` }, pageAccessToken);
    } catch (error) {
      console.error('Erreur API Imgur:', error);
      await sendMessage(senderId, { text: "❌ Erreur lors de l’upload de l’image." }, pageAccessToken);
    }
  }
};
