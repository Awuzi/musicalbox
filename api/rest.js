const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// Retourne tout le fichier JSon
router.get('/', function (req, res, next) {
  fs.readFile(path.join(__dirname, 'songs.json'), 'utf8', (err, songs) => {
    if (err) {
      throw err
    }
    liste = JSON.parse(songs)
    res.send(liste)
  })
})

// Retourne les musiques du genre
router.get('/:genre', (req, res, next) => {
  let leGenre = req.params.genre
  let nb = 0
  fs.readFile(path.join(__dirname, 'songs.json'), 'utf8', function (err, songs) {
    if (err) {
      throw err
    }
    let resultat = JSON.parse(songs)
    // Notre fichier contient en fait un objet… contenant d’autres objets
    let liste = resultat.songs
    for (let i in liste) {
      if (liste[i].genre === leGenre) {
        nb = nb + 1
      }
    }
    if (nb == 0) {
      res.send('il n\'y a pas de chansons du genre : ' + leGenre)
    } else {
      res.send('il y a ' + nb + ' chanson(s) de ce genre...')
    }
  })
})

// Retourne la musique en fonction de son index
router.get('/id/:id', function (req, res, next) {
  let id = req.params.id
  let ismusic = false
  fs.readFile(path.join(__dirname, 'songs.json'), 'utf8', function (err, songs) {
    if (err) {
      throw err
    }
    let resultat = JSON.parse(songs)
    let lamusic
    // Notre fichier contient en fait un objet… contenant d’autres objets
    let liste = resultat.songs
    for (let i in liste) {
      if (i === id) {
        ismusic = true
        lamusic = liste[i].titre
      }
    }
    if (ismusic === false) {
      res.send('il n\'y a pas de chansons avec cet identifiant : ' + id)
    } else {
      res.send('il y a une chanson  : ' + lamusic + ' avec cet identifiant.')
    }
  })
})

module.exports = router