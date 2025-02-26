const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'gojo',
  description: 'Discutez avec Satoru Gojo, le plus fort !',
  author: 'Arn & MakoyQx',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").trim();

    if (!query) {
      const defaultMessage = 
        "💙 Salut, je suis Gojo Satoru !\n" +
        "Pose-moi une question et découvre ma puissance !\n\n" +
        "_(Développé par Stanley Stawa)_";

      return await sendMessage(senderId, { text: defaultMessage }, pageAccessToken);
    }

    if (["sino creator mo?", "qui t'a créé ?", "qui est ton créateur ?"].includes(query.toLowerCase())) {
      return await sendMessage(senderId, { text: "Mon créateur est Stanley Stawa !" }, pageAccessToken);
    }

    await handleGojoResponse(senderId, query, pageAccessToken);
  },
};

// 📌 Récupérer la réponse de Gojo via l'API
const handleGojoResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/gojo";
  let gojoResponse = "Je réfléchis à une réponse..."; // Réponse par défaut

  try {
    const { data } = await axios.get(apiUrl);
    if (data.reply && data.reply.trim() !== "") {
      gojoResponse = data.reply;
    }
  } catch (error) {
    console.error('❌ Erreur API Gojo détectée, mais le bot continue.');
  }

  // Envoi de la réponse
  await sendMessage(senderId, { text: gojoResponse }, pageAccessToken);
};
