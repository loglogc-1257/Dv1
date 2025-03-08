const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const stateFile = 'senku_state.json';

const loadState = () => {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {
    return {};
  }
};

const saveState = (state) => {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
};

module.exports = {
  name: 'senku',
  description: "Active ou désactive les réponses de Senku.",
  author: 'Arn & coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const command = args.join(" ").toLowerCase().trim();
    let activeUsers = loadState();

    if (command === "senku on") {
      activeUsers[senderId] = true;
      saveState(activeUsers);
      return await sendMessage(senderId, { text: "🧪 Senku est activé ! Posez-moi vos questions." }, pageAccessToken);
    }

    if (command === "senku off") {
      delete activeUsers[senderId];
      saveState(activeUsers);
      return await sendMessage(senderId, { text: "🛑 Senku est désactivé." }, pageAccessToken);
    }

    if (!activeUsers[senderId]) return;

    const apiUrl = `https://kaiz-apis.gleeze.com/api/senku?ask=${encodeURIComponent(command)}&uid=${senderId}&lang=fr`;

    try {
      const { data } = await axios.get(apiUrl);
      await sendMessage(senderId, { text: `🔬 Senku : ${data.response}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Erreur API Senku:', error.message);
      await sendMessage(senderId, { text: "⚠️ Une erreur s'est produite avec Senku." }, pageAccessToken);
    }
  },
};
