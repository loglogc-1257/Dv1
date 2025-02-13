const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

module.exports = {
  name: 'ocr',
  description: 'Extrait le texte d’une image en utilisant l’OCR.',
  usage: '-ocr [image_url]',
  author: 'coffee',

  async execute(senderId, args) {
    // Vérifier si un argument est fourni
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Veuillez fournir une URL d\'image.' }, pageAccessToken);
      return;
    }

    const imageUrl = args[0];

    // Vérifier si l'argument est une URL d'image valide
    if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
      await sendMessage(senderId, { text: '❌ L\'URL doit être une image valide (JPG, PNG, WEBP, GIF).' }, pageAccessToken);
      return;
    }

    try {
      // Appel à l'API OpenAI Vision pour l'OCR
      const response = await axios.post(
        'https://api.openai.com/v1/images/vision',
        {
          image_url: imageUrl,
          task: "ocr"
        },
        {
          headers: {
            'Authorization': `Bearer ${pageAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const extractedText = response.data.text?.trim() || "❌ Aucun texte détecté sur l'image.";

      // Envoyer la réponse à l'utilisateur
      await sendMessage(senderId, { text: `📝 **Texte extrait :**\n\n${extractedText}` }, pageAccessToken);

    } catch (error) {
      console.error('Erreur OCR:', error);
      await sendMessage(senderId, { text: '⚠️ Erreur : Impossible d\'extraire le texte de l\'image pour le moment.' }, pageAccessToken);
    }
  }
};
