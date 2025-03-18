ppconst axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'stanley', // Remplacement de 'ronald' par 'stanley'
    description: 'Pose une question et reçois une réponse de l\'A Stanley.', // Remplacement de 'Ronald' par 'Stanley'
    usage: 'stanley [votre question]', // Remplacement de 'ronald' par 'stanley'
    author: 'STANLEY SORY', // Remplacement de 'RONALD SORY' par 'STANLEY SORY'

    async execute(senderId, args, pageAccessToken) {
        console.log("Commande stanley appelée avec args:", args); // Remplacement de 'ronald' par 'stanley'

        const prompt = args.join(' ');

        if (!prompt) {
            console.log("Aucune question posée.");
            return sendMessage(senderId, {
                text: "👋 Salut ! Pose-moi une question et je te répondrai avec plaisir !"
            }, pageAccessToken);
        }

        try {
            console.log("Envoi de la requête API avec question:", prompt);

            // Remplacement de l'URL de l'API
            const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(prompt)}&uid=${senderId}&webSearch=On`;

            const { data } = await axios.get(apiUrl, { timeout: 5000 });

            console.log("Réponse brute de l'API :", data);

            if (!data || typeof data !== 'string') {
                console.error("Erreur : Réponse invalide de l'API.");
                return sendMessage(senderId, {
                    text: '🚨 Oups ! Je n’ai pas pu obtenir une réponse correcte. Réessaie plus tard.'
                }, pageAccessToken);
            }

            const botResponse = data;

            const responseMessage = `🤖 Stanley AI ✨\n${botResponse}`; // Remplacement de 'Ronald' par 'Stanley'

            await sendMessage(senderId, { text: responseMessage }, pageAccessToken);

        } catch (error) {
            console.error("Erreur API :", error.message || error.response?.data);

            let errorMessage = '🚨 Oups ! Impossible d’obtenir une réponse pour le moment.';

            if (error.code === 'ECONNABORTED') {
                errorMessage = '⏳ L’API a mis trop de temps à répondre. Réessaie plus tard.';
            } else if (error.response) {
                errorMessage = ` Erreur API : ${error.response.status} - ${error.response.statusText}`;
            }

            return sendMessage(senderId, { text: errorMessage }, pageAccessToken);
        }
    }
};