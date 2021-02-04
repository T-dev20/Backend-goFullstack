//importation du package http de Node,permettant de créer un serveur
const http = require('http');
//importation de l'app
const app = require('./app');

//Serveur prêt
const server = http.createServer(app);

//écoute de la requête via un port qui est par def le 3000
server.listen(process.env.PORT || 3000);