const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'trivia',
  description: 'Pose une question de quiz.',
  async execute(senderId) {
    try {
      const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const question = data.results[0];
      const options = question.incorrect_answers.concat(question.correct_answer).sort(() => Math.random() - 0.5);
      
      let message = `🧠 **Question :** ${question.question}\n\n`;
      options.forEach((opt, index) => {
        message += `${index + 1}. ${opt}\n`;
      });

      await sendMessage(senderId, { text: message + "\n\nRéponds avec le numéro de la bonne réponse !" }, token);

    } catch (error) {
      console.error(error);
      await sendMessage(senderId, { text: '❌ Impossible de récupérer une question.' }, token);
    }
  }
};
