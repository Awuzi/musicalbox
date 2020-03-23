const express = require('express');
const router = express.Router();

// Liste la vue des titres
/* router.get('/', function (req, res, next) {
    let tabMusiques = [];
    fs.readFile(path.join(__dirname, '../api/songs.json'), 'utf8', function (err, songs) {
        if (err) {
            throw err;
        }
        let resultat = JSON.parse(songs);
        let liste = resultat.songs;
        for (let i in liste) {
            tabMusiques.push(liste[i].titre);
        }
        res.render('musiques', { title: 'MusicalBox', tabMusiques: tabMusiques });
    });
});
*/
/* Liste des musiques */
router.get('/', function(req, res, next) {
    const db = req.db;
    const collection = db.get('titres');
    collection.find({}, {}, function(e, listeMusiques) {
        res.render('musiques', {
            'title': 'Liste des musiques',
            'musiqueslist': listeMusiques,
        });
    });
});

// Joue le morceau
router.get('/:titre', function(req, res, next) {
    // ms.pipe(req, res, chanson + '.mp3');
    const URL = '/raw/' + req.params.titre + '.mp3';
    res.render('jouerMusique', {title: 'lamusique', titre: URL});
});

// Traitement pour la réception du fichier musical en asynchrone
/* router.post('/upload', async function (req, res, next) {
    try {
        // Si aucun fichier...
        if (req.files.upload.size == 0) {
            // Retour du message d'erreur, en production cela ne se fait pas...
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // Récupérération du fichier avec son "name" HTML
            let morceau = req.files.upload;
            // Déplacement du fichier à l'aide de la méthode mv()
            morceau.mv('./public/raw/' + morceau.name);
            // Affichage de la réponse en mode console
            console.log({
                status: true,
                message: 'Fichier uploaded',
                data: {
                    name: morceau.name,
                    mimetype: morceau.mimetype,
                    size: morceau.size
                }
            });
            // Redirection vers la liste, donc vers une vue existante

            let URL = '/raw/' + morceau.name;
            res.render('jouerMusique', { title: 'lamusique', titre: URL });
            // res.redirect(musiques);
        }
    } catch (err) {
        // Là, cela c'est mal passé...
        res.status(500).send(err);
    }
});
*/

// Traitement pour la reception du fichier musical
router.post('/upload', async function(req, res, next) {
    try {
    // Si aucun fichier...
        if (!req.files) {
            // Retour du message d'erreur, en production cela ne se fait pas...
            res.send({
                status: false,
                message: 'No file uploaded',
            });
        } else {
            // Récupérération du fichier avec son "name" HTML
            const morceau = req.files.upload;
            // Déplacement du fichier à l'aide de la méthode mv()
            morceau.mv('./raw/' + morceau.name);
            // Affichage de la réponse en mode console
            console.log({
                status: true,
                message: 'Fichier uploaded',
                data: {
                    name: morceau.name,
                    mimetype: morceau.mimetype,
                    size: morceau.size,
                },
            });
            // Ajout effectif et redirection vers la liste
            const db = req.db;
            const tmp = morceau.name;
            // il vire le .mp3
            const nom = tmp.substring(0, tmp.lastIndexOf('.'));
            const auteur = req.body.auteur;
            const genre = req.body.genre;
            const collection = db.get('titres');
            collection.insert({
                'nom': nom,
                'auteur': auteur,
                'genre': genre,
            }, function(err, doc) {
                if (err) {
                    console.log('Insertion non effectuée !');
                } else {
                    console.log('Insertion effectuée !');
                }
                // Redirection vers la liste, donc vers une vue existante
                res.redirect('/musiques');
            });
        }
    } catch (err) {
    // Là, cela c'est mal passé...
        res.status(500).send(err);
    }
});


module.exports = router;
