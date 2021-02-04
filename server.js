//importation du package http de Node,permettant de créer un serveur
const http = require('http');

//Serveur prêt
const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});

//écoute de la requête via un port qui est par def le 3000
server.listen(process.env.PORT || 3000);