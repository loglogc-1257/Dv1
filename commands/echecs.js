const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const LICHESS_API_URL = "https://lichess.org/api";
const LICHESS_BOT_TOKEN = "lip_uK9dXlZSbs0CBd4q88fp"; // API Key Lichess
let gameId = null; // Stocke l'ID de la partie en cours

module.exports = {
  name: 'echecs',
  description: 'Joue aux échecs avec affichage du plateau sur Messenger.',
  usage: 'echecs [start/move/status/resign]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Commande incorrecte. Utilisation :\n\n♟️ `echecs start [niveau]` → Commencer une partie contre l’IA\n♟️ `echecs move [coup]` → Jouer un coup (ex: e2e4)\n♟️ `echecs status` → Voir l’état de la partie\n♟️ `echecs resign` → Abandonner la partie' }, pageAccessToken);
      return;
    }

    const action = args[0].toLowerCase();
    
    // **1️⃣ Démarrer une partie**
    if (action === "start") {
      const level = args[1] ? parseInt(args[1]) : 3; // Niveau IA (1-8)

      try {
        const response = await axios.post(`${LICHESS_API_URL}/challenge/ai`, {
          level: level,
          color: "random"
        }, {
          headers: { Authorization: `Bearer ${LICHESS_BOT_TOKEN}` }
        });

        gameId = response.data.id;
        
        await sendMessage(senderId, {
          text: `♟️ Partie commencée contre l’IA (Niveau ${level}) !\n🔗 [Jouer ici](https://lichess.org/${gameId})`
        }, pageAccessToken);

        // Envoyer l’image du plateau de départ
        await sendBoardImage(senderId, pageAccessToken);
      } catch (error) {
        console.error("Erreur lors du lancement de la partie :", error);
        await sendMessage(senderId, { text: '❌ Erreur lors du lancement de la partie. Réessaie plus tard.' }, pageAccessToken);
      }
      return;
    }

    // **2️⃣ Faire un coup**
    if (action === "move") {
      if (!args[1] || !gameId) {
        await sendMessage(senderId, { text: '❌ Indique un coup valide (ex: e2e4) et assure-toi qu’une partie est en cours.' }, pageAccessToken);
        return;
      }

      const move = args[1]; // Exemple : "e2e4"

      try {
        await axios.post(`${LICHESS_API_URL}/bot/game/${gameId}/move/${move}`, {}, {
          headers: { Authorization: `Bearer ${LICHESS_BOT_TOKEN}` }
        });

        await sendMessage(senderId, { text: `✅ Coup joué : **${move}**` }, pageAccessToken);

        // Envoyer la mise à jour du plateau après le coup
        await sendBoardImage(senderId, pageAccessToken);
      } catch (error) {
        console.error("Erreur lors du coup :", error);
        await sendMessage(senderId, { text: '❌ Coup invalide ou erreur API. Vérifie la partie en cours.' }, pageAccessToken);
      }
      return;
    }

    // **3️⃣ Obtenir le statut de la partie**
    if (action === "status") {
      if (!gameId) {
        await sendMessage(senderId, { text: '❌ Aucune partie en cours. Utilise `echecs start` pour en commencer une.' }, pageAccessToken);
        return;
      }

      try {
        const response = await axios.get(`${LICHESS_API_URL}/game/export/${gameId}`, {
          headers: { Authorization: `Bearer ${LICHESS_BOT_TOKEN}` }
        });

        const moves = response.data.moves;
        const winner = response.data.winner || "Aucun";

        await sendMessage(senderId, {
          text: `♟️ **Statut de la partie**\n\n📜 **Coups joués** : ${moves}\n🏆 **Gagnant** : ${winner}\n🔗 [Voir la partie](https://lichess.org/${gameId})`
        }, pageAccessToken);

        // Envoyer l’image du plateau actuel
        await sendBoardImage(senderId, pageAccessToken);
      } catch (error) {
        console.error("Erreur statut partie :", error);
        await sendMessage(senderId, { text: '❌ Impossible de récupérer l’état de la partie.' }, pageAccessToken);
      }
      return;
    }

    // **4️⃣ Abandonner la partie**
    if (action === "resign") {
      if (!gameId) {
        await sendMessage(senderId, { text: '❌ Aucune partie en cours à abandonner.' }, pageAccessToken);
        return;
      }

      try {
        await axios.post(`${LICHESS_API_URL}/bot/game/${gameId}/resign`, {}, {
          headers: { Authorization: `Bearer ${LICHESS_BOT_TOKEN}` }
        });

        gameId = null; // Réinitialiser l'ID de partie
        await sendMessage(senderId, { text: '🏳️ Tu as abandonné la partie.' }, pageAccessToken);
      } catch (error) {
        console.error("Erreur abandon partie :", error);
        await sendMessage(senderId, { text: '❌ Impossible d’abandonner la partie.' }, pageAccessToken);
      }
      return;
    }

    // Si l'action n'est pas reconnue
    await sendMessage(senderId, { text: '❌ Commande invalide. Essaie : `echecs start`, `echecs move`, `echecs status`, `echecs resign`.' }, pageAccessToken);
  }
};

// **📌 Fonction pour envoyer l’image du plateau**
async function sendBoardImage(senderId, pageAccessToken) {
  if (!gameId) return;

  const boardImageUrl = `https://lichess.org/game/export/${gameId}.png`;

  await sendMessage(
senderId, {
    attachment: {
      type: 'image',
      payload: {
        url: boardImageUrl
      }
    }
  }, pageAccessToken);
}
