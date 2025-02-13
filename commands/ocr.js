const fs = require('fs');
const fetch = require('node-fetch');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'ocr',
  description: 'Extrait le texte d’une image en utilisant l’OCR.',
  usage: '-ocr [image_url]',
  author: 'coffee',

  async execute(senderId, args) {
    if (!args || args.length === 0) {
      return sendMessage(senderId, { text: "❌ Veuillez fournir une URL d'image valide." });
    }

    const imageUrl = args[0];

    // Vérification de l'URL
    if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
      return sendMessage(senderId, { text: "❌ L'URL doit être une image valide (JPG, PNG, WEBP, GIF)." });
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/vision', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl,
          task: "ocr"
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API (${response.status}): ${await response.text()}`);
      }

      const data = await response.json();
      const extractedText = data.text?.trim() || "❌ Aucun texte détecté sur l'image.";

      sendMessage(senderId, { text: `📝 **Texte extrait :**\n\n${extractedText}` });
    } catch (error) {
      console.error("❌ Erreur OCR :", error);
      sendMessage(senderId, { text: "⚠️ Impossible d'extraire le texte de l'image pour le moment." });
    }
  }
};
