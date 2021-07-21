'use strict'
const express = require("express")
const router = express.Router()
const userController = require("./usercontroller.js")

router.get('/', userController.testIt)
router.post('/applys', userController.applyManyUsers)
router.post('/apply', userController.applyUser)
router.post('/auth', userController.userLogin)
router.put('/update', userController.updateUser)
router.delete('/removeuser', userController.removeUser)
router.put('/bookmarkfilm/:imdbid', userController.bookmarkFilm)
router.put('/ratefilm/:imdbid', userController.rateFilm)
router.get('/list', userController.listUsers)

router.use(
  (req, res, next) => {
    console.log('~Endpoint (User) not call or invalid access!!!~')
    res.status(404).send(
      {'status': 404, 'description': 'endpoint (User) not found'}
    )
  }
)

module.exports = router