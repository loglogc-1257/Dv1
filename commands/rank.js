const axios = require('axios');
const Canvas = require("canvas");
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8').trim();

Canvas.registerFont(`${__dirname}/assets/font/BeVietnamPro-Bold.ttf`, {
  family: "BeVietnamPro-Bold"
});
Canvas.registerFont(`${__dirname}/assets/font/BeVietnamPro-SemiBold.ttf`, {
  family: "BeVietnamPro-SemiBold"
});

module.exports = {
  name: "rank",
  description: "Affiche le niveau et l'expérience d'un utilisateur.",
  author: "NTKhang",
  usage: "rank [@mention]",
  
  async execute(senderId, args, pageAccessToken) {
    const userId = args.length > 0 ? args[0] : senderId;

    await sendMessage(senderId, { text: "📊 Récupération des données de niveau..." }, pageAccessToken);

    try {
      const response = await axios.get(`https://api.example.com/rank?userId=${userId}`);
      const data = response.data;

      if (!data || !data.exp || !data.level) {
        return await sendMessage(senderId, { text: "❌ Impossible de récupérer les informations de niveau." }, pageAccessToken);
      }

      const rankCard = await generateRankCard(data);
      await sendMessage(senderId, { attachment: rankCard }, pageAccessToken);
    } catch (error) {
      console.error("Erreur Rank:", error.message);
      await sendMessage(senderId, { text: "❌ Une erreur est survenue lors de la récupération du niveau." }, pageAccessToken);
    }
  }
};

async function generateRankCard({ name, exp, level, rank }) {
  const width = 800;
  const height = 300;
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Fond
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, width, height);

  // Texte
  ctx.fillStyle = "#fff";
  ctx.font = "bold 30px BeVietnamPro-Bold";
  ctx.fillText(`👤 ${name}`, 50, 60);
  ctx.fillText(`🏆 Rang: ${rank}`, 50, 120);
  ctx.fillText(`📈 Niveau: ${level}`, 50, 180);
  ctx.fillText(`⚡ Exp: ${exp}`, 50, 240);

  return canvas.toBuffer();
}
