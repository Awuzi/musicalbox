const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'SLAeaerzM',
    });
});

// Utilisation d'un paramètre variable dans l'URL
router.get('/n/:nom', function(req, res, next) {
    const leNom = req.params.nom;
    res.render('index', {
        title: leNom,
    });
});

module.exports = router;
