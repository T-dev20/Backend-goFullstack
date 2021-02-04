//importation de Express
const express = require('express');

/****Notre application sera contenue dans cette constante
 la méthode express() permet de créer une app Express*****/
const app = express();

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue !'});
});

/*** Exportation de l'app pour pouvoir y accéder depuis les 
autres fichiers du projet, notamment notre serveur Node *****/
module.exports = app;