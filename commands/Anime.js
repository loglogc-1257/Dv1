const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'rank',
  description: "Affiche le classement d'un utilisateur.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;

    try {
      // Obtenir le nom de l'utilisateur depuis l'API Graph de Facebook
      const userInfo = await axios.get(`https://graph.facebook.com/${senderId}?fields=first_name,last_name&access_token=${pageAccessToken}`);
      const firstName = userInfo.data.first_name || "Utilisateur";
      const lastName = userInfo.data.last_name || "";
      const nickname = `${firstName} ${lastName}`.trim(); // Construire le nom complet

      const apiUrl = "https://kaiz-apis.gleeze.com/api/rank";

      // Simuler des valeurs aléatoires pour le niveau, le classement et l'XP
      const level = Math.floor(Math.random() * 200) + 1;
      const rank = Math.floor(Math.random() * 1000) + 1;
      const xp = Math.floor(Math.random() * 100000) + 1;
      const requiredXP = xp + Math.floor(Math.random() * 50000) + 1000;
      const status = "online";
      const avatar = `https://graph.facebook.com/${senderId}/picture?type=large`; // Photo de profil Facebook

      // Appel à l'API Rank
      const { data } = await axios.get(apiUrl, {
        params: {
          level,
          rank,
          xp,
          requiredXP,
          nickname,
          status,
          avatar
        }
      });

      // Message formaté
      const rankMessage = 
        `🎖️ **Rang de ${nickname}** 🎖️\n\n` +
        `🔹 **Niveau**: ${level}\n` +
        `🏆 **Classement**: #${rank}\n` +
        `✨ **XP**: ${xp} / ${requiredXP}\n` +
        `🟢 **Statut**: ${status}\n` +
        `🖼️ **Avatar**: ${avatar}`;

      await sendMessage(senderId, { text: rankMessage }, pageAccessToken);
    } catch (error) {
      console.error('Erreur Rank:', error.message);
      await sendMessage(senderId, { text: "⚠️ Erreur lors de la récupération du classement." }, pageAccessToken);
    }
  },
};
  
