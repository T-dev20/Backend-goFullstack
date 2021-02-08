const express = require('express');
//création du routeur Express
const router = express.Router();

const Thing = require('../models/thing');

/*Ici, vous créez une instance de votre modèle Thing en 
lui passant un objet JavaScript contenant toutes les informations
requises du corps de requête analysé (en ayant supprimé en amont le faux_id 
envoyé par le front-end).

L'opérateur spread ... est utilisé pour faire une copie 
de tous les éléments de req.body*/
//Requête POST
router.post('/', (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


/*nous utilisons la méthode get() pour répondre 
uniquement aux demandes GET à cet endpoint ;
nous utilisons deux-points : en face du segment dynamique 
de la route pour la rendre accessible en tant que paramètre ;

nous utilisons ensuite la méthode findOne() dans notre 
modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ;
ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;

si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée*/
router.get('/:id', (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

router.put('/:id', (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//Requête GET générale
router.get('/' +
  '', (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports = router;