//importation de Express
const express = require('express');

/****Notre application sera contenue dans cette constante
 la méthode express() permet de créer une app Express*****/
const app = express();

/*** Exportation de l'app pour pouvoir y accéder depuis les 
autres fichiers du projet, notamment notre serveur Node *****/
module.exports = app;