const Thing = require('../models/thing');
const fs = require('fs');

// Pour ajouter un fichier à la requête, le front-end doit envoyer les 
// données de la requête sous la forme form-data, et non sous forme de JSON. 
// Le corps de la requête contient une chaîne thing , qui est simplement 
// un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() 
// pour obtenir un objet utilisable.

// Nous devons également résoudre l'URL complète de notre image, car 
// req.file.filename ne contient que le segment filename . Nous utilisons 
// req.protocol pour obtenir le premier segment (dans notre cas 'http' ). 
// Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre 
// l'hôte du serveur (ici, 'localhost:3000' ). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
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
};

// Dans cette version modifiée de la fonction, on crée un objet thingObject 
// qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle
// image ; s'il n'existe pas, on traite simplement l'objet entrant. 
// On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// nous utilisons l'ID que nous recevons comme paramètre pour accéder 
// au Thing correspondant dans la base de données ;

// nous utilisons le fait de savoir que notre URL d'image contient un 
// segment /images/ pour séparer le nom de fichier ;

// nous utilisons ensuite la fonction unlink du package fs pour supprimer 
// ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;

// dans le callback, nous implémentons la logique d'origine, en supprimant 
// le Thing de la base de données.
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
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
};