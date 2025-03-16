const axios = require("axios");
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8').trim();

async function getBaseApiUrl() {
  try {
    const { data } = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
    return data.mostakim;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'API:", error);
    return null;
  }
}

module.exports = {
  name: "4k",
  aliases: ["remini"],
  description: "Améliore une image en 4K.",
  author: "Romim",
  usage: "4k (répondre à une image)",
  
  async execute(senderId, args, pageAccessToken, event) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return await sendMessage(senderId, { text: "❌ Répondez à une image avec cette commande." }, pageAccessToken);
    }

    const imageUrl = event.messageReply.attachments[0].url;
    const baseApiUrl = await getBaseApiUrl();
    
    if (!baseApiUrl) {
      return await sendMessage(senderId, { text: "⚠️ L'API est temporairement indisponible. Réessayez plus tard." }, pageAccessToken);
    }

    try {
      await sendMessage(senderId, { text: "🔄 Amélioration de l'image en cours..." }, pageAccessToken);
      const apiUrl = `${baseApiUrl}/remini?input=${encodeURIComponent(imageUrl)}`;
      
      const imageStream = await axios.get(apiUrl, { responseType: 'stream' });

      await sendMessage(senderId, {
        text: "✅ Voici votre image améliorée en 4K :",
        attachment: imageStream.data
      }, pageAccessToken);
      
    } catch (error) {
      console.error("Erreur API Remini:", error.message);
      await sendMessage(senderId, { text: `❌ Une erreur s'est produite : ${error.message}` }, pageAccessToken);
    }
  }
};
