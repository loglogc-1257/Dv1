const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

// Objet pour stocker les surnoms définis par les utilisateurs
const userNicknames = {};

module.exports = {
  name: 'rank',
  description: "Affiche le classement d'un utilisateur.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;

    try {
      console.log(`🔹 Demande de classement pour ${senderId}`);

      // Vérifier si l'utilisateur a déjà défini un surnom
      let nickname = userNicknames[senderId] || `Utilisateur_${senderId}`;

      // Si l'utilisateur entre un pseudo avec la commande (!rank pseudo)
      if (args.length > 0) {
        nickname = args.join(" ").trim();
        userNicknames[senderId] = nickname; // Sauvegarder le surnom
        console.log(`📝 Surnom défini : ${nickname}`);
      }

      const apiUrl = "https://kaiz-apis.gleeze.com/api/rank";

      // Génération de valeurs aléatoires pour le niveau et l'XP
      const level = Math.floor(Math.random() * 200) + 1;
      const rank = Math.floor(Math.random() * 1000) + 1;
      const xp = Math.floor(Math.random() * 100000) + 1;
      const requiredXP = xp + Math.floor(Math.random() * 50000) + 1000;
      const status = "online";
      const avatar = `https://graph.facebook.com/${senderId}/picture?type=large`; // Photo Facebook

      console.log(`📡 Envoi de la requête à l'API Rank...`);

      // Appel à l'API Rank
      const response = await axios.get(apiUrl, {
        params: { level, rank, xp, requiredXP, nickname, status, avatar }
      });

      console.log(`✔️ Réponse reçue de l'API Rank`);

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
      console.error('❌ Erreur Rank:', error.message);

      await sendMessage(senderId, { text: "⚠️ Erreur lors de la récupération du classement. Réessayez plus tard !" }, pageAccessToken);
    }
  },
};
