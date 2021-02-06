//importation de Express
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');


mongoose.connect('mongodb+srv://trav-dev1215:QfXZU85x6VpzIgLJ@cluster0.lzdtw.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


/****Notre application sera contenue dans cette constante
 la méthode express() permet de créer une app Express*****/
const app = express();


//1) accéder à notre API depuis n'importe quelle origine
//2)ajouter les headers mentionnés aux requêtes envoyées vers notre API 
//3)envoyer des requêtes avec les méthodes mentionnées
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

/*Ici, vous créez une instance de votre modèle Thing en 
lui passant un objet JavaScript contenant toutes les informations
requises du corps de requête analysé (en ayant supprimé en amont le faux_id 
envoyé par le front-end).

L'opérateur spread ... est utilisé pour faire une copie 
de tous les éléments de req.body*/
//Requête POST
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()/*enregistre le Thing dans la base de D*/
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
    next();
});


/*nous utilisons la méthode get() pour répondre 
uniquement aux demandes GET à cet endpoint ;
nous utilisons deux-points : en face du segment dynamique 
de la route pour la rendre accessible en tant que paramètre ;

nous utilisons ensuite la méthode findOne() dans notre 
modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ;
ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;

si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée*/
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});


//Requête GET
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

/*** Exportation de l'app pour pouvoir y accéder depuis les 
autres fichiers du projet, notamment notre serveur Node *****/
module.exports = app;