
const express = require("express")
const router = express.Router()
const filmController = require("./filmcontroller.js")

router.get('/', filmController.testIt)
router.get('/infofilm/:keyword', filmController.searchByKeyword)
router.post('/imfilms', filmController.addManyFilms)
router.post('/imfilm', filmController.addNewFilm)
router.get('/film/:key/:val', filmController.searchByKeyPairValue)
router.get('/list', filmController.listAllFilms)
router.put('/updatefilm/:imdbid', filmController.updateTheFilm)
router.delete('/removefilm/:imdbid', filmController.deleteTheFilm)

router.use(
  (req, res, next) => {
    console.log('~Endpoint (film) not call or invalid access!!!~')
    res.status(404).send(
      {'status': 404, 'description': 'endpoint not found'}
    )
  }
)

module.exports = router