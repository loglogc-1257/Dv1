const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

module.exports = {
  name: 'ocr',
  description: 'Extrait le texte d’une image hébergée sur Imgur.',
  usage: '-ocr [URL_IMGUR]',
  author: 'coffee',

  async execute(senderId, args) {
    // Vérifier si un argument est fourni
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Veuillez fournir une URL Imgur.' }, pageAccessToken);
      return;
    }

    const imageUrl = args[0];

    // Vérifier si l'URL provient bien d'Imgur
    if (!imageUrl.match(/^https?:\/\/i\.imgur\.com\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
      await sendMessage(senderId, { text: '❌ L\'URL doit être une image hébergée sur Imgur (ex: https://i.imgur.com/xxxxx.jpg).' }, pageAccessToken);
      return;
    }

    try {
      // Télécharger l'image depuis Imgur
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBase64 = Buffer.from(imageResponse.data, 'binary').toString('base64');

      // Envoyer l'image à l’API OpenAI pour l’OCR
      const ocrResponse = await axios.post(
        'https://api.openai.com/v1/images/vision',
        {
          image: `data:image/jpeg;base64,${imageBase64}`,
          task: "ocr"
        },
        {
          headers: {
            'Authorization': `Bearer ${pageAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const extractedText = ocrResponse.data.text?.trim() || "❌ Aucun texte détecté sur l'image.";

      // Envoyer la réponse à l'utilisateur sur Messenger
      await sendMessage(senderId, { text: `📝 **Texte extrait :**\n\n${extractedText}` }, pageAccessToken);

    } catch (error) {
      console.error('❌ Erreur OCR:', error);
      await sendMessage(senderId, { text: '⚠️ Erreur : Impossible d\'extraire le texte de l\'image pour le moment.' }, pageAccessToken);
    }
  }
};
