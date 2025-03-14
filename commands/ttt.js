const { sendMessage } = require('../handles/sendMessage');

const games = {}; // Stocke les parties en cours

module.exports = {
  name: 'ttt',
  description: "Joue au morpion contre l'IA.",
  usage: 'ttt [X/O] [case]',
  author: 'Stanley',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length < 2) {
      await sendMessage(senderId, { text: "❌ Utilisation : ttt [X/O] [1-9]" }, pageAccessToken);
      return;
    }

    const symbol = args[0].toUpperCase();
    const position = parseInt(args[1], 10);

    if (!['X', 'O'].includes(symbol) || isNaN(position) || position < 1 || position > 9) {
      await sendMessage(senderId, { text: "❌ Choisissez X ou O et une case entre 1 et 9." }, pageAccessToken);
      return;
    }

    if (!games[senderId]) {
      games[senderId] = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    }

    if (games[senderId][position - 1] !== " ") {
      await sendMessage(senderId, { text: "❌ Cette case est déjà prise." }, pageAccessToken);
      return;
    }

    games[senderId][position - 1] = symbol;
    await sendMessage(senderId, { text: afficherGrille(games[senderId]) }, pageAccessToken);
  }
};

function afficherGrille(grille) {
  return `\n${grille.slice(0, 3).join(" | ")}\n${grille.slice(3, 6).join(" | ")}\n${grille.slice(6, 9).join(" | ")}`;
}
