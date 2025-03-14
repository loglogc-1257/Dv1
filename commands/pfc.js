const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'pfc',
  description: "Joue à Pierre-Papier-Ciseaux.",
  usage: 'pfc [pierre/papier/ciseaux]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    const choixUtilisateur = args[0]?.toLowerCase();
    const choixPossibles = ["pierre", "papier", "ciseaux"];
    const choixBot = choixPossibles[Math.floor(Math.random() * 3)];

    if (!choixUtilisateur || !choixPossibles.includes(choixUtilisateur)) {
      await sendMessage(senderId, { text: "❌ Utilisation : pfc [pierre/papier/ciseaux]" }, pageAccessToken);
      return;
    }

    let resultat = "Égalité !";
    if (
      (choixUtilisateur === "pierre" && choixBot === "ciseaux") ||
      (choixUtilisateur === "papier" && choixBot === "pierre") ||
      (choixUtilisateur === "ciseaux" && choixBot === "papier")
    ) {
      resultat = "✅ Tu as gagné !";
    } else if (choixUtilisateur !== choixBot) {
      resultat = "❌ Tu as perdu...";
    }

    await sendMessage(senderId, { text: `🆚 Bot a joué : ${choixBot}\n\n${resultat}` }, pageAccessToken);
  }
};
