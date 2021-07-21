'use strict'

const Config = require('./config')
const mongoClient = require("mongodb").MongoClient
//const fetch = require("node-fetch")
const config = new Config()

const responseStatus = {
	'ok': 200,
	'created': 201,
	'notModified': 304,
	'notFound': 404,
  'noContent': 204
}

const usersController = {
  testIt(req, res){
    if (res.statusCode === responseStatus.ok) {
      res.send('Testing...\nGlad! You are connecting the api (User) ')
    } else {
      res.send({"status": res.status, "description":"User not connected"});
    }    
  },
  async applyManyUsers(req, res) {
    console.log('someone going to insert many users')
    let mapForPost = req.body    
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   
      console.log('No authorized key provided')
      res.status(401).send({"status": 401, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapFound = await findAuthKey(mapForPost.authorizedkey) 
    console.log(`mapFound's issuccess: ${mapFound.issuccess}`)
    if (mapFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapFound.errmsg})
      return
    }
    console.log(`mapFound's isexist: ${mapFound.isexist}`)
    if (mapFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }  
    console.log('role: ' + mapFound.role)
    if (mapFound.role !== 'staff') {
      res.status(403).send({"status": 403, "description": "restrict to access"})
      return
    }
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
    if(err){
      console.log(err)
      res.status(500).send({"status": 500, "description": err})
    } else {
      const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())  
      let lstObj = mapForPost.userlist
        if (lstObj === undefined){
          res.status(400).send({"status": 400, "description": "Content Not Exist"})
          return
        } 
        let lstObj_1 = []
        lstObj.forEach(
          (elem) => {
            //only 6 fields required + 2 extra fields  
            let obj_1 = {
              username : elem.username,
              password : elem.password,
              email : elem.email,
              role : elem.role,
              firstname : elem.firstname,
              lastname : elem.lastname,
              authorizedkey: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
              createdt : new Date()
            }
            lstObj_1.push(obj_1)    
          }
        )    
      collection.insertMany(lstObj_1, (err) => {
        if(err) {
          res.status(500).send({"status":500, "description":err})
        } else {
          res.status(201).send({"status":201, "description": "Users insert successfully (Bulk)"})
        }
      })
      db.close()
    }})
  },
  applyUser(req, res) {
    console.log('someone going to insert a new user')
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
    if(err){
      console.log(err)
      res.status(500).send({"status": 500, "description": err})
    } else {
      const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())  
      let mapForPost = req.body
      //create and add accesskey
      mapForPost.authorizedkey = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
      mapForPost.createdt = new Date()    
      collection.insertOne(mapForPost, (err) => {
        if(err) {
          res.status(500).send({"status":500, "description":err})
        } else {
          res.status(201).send({"status":201, "description": "Data insert successfully"})
        }
      })
      db.close()
    }})
  },
  userLogin(req, res) {
    console.log('someone trying to login')
    let mapForPost = req.body
    if (mapForPost.username === undefined || mapForPost.username === null ) {    
    console.log('No username provided')
      res.status(400).send({"status": 400, "description": 'No username provided'})
      return
    } 
    if (mapForPost.password === undefined || mapForPost.password === null ) {    
      console.log('No password provided')
      res.status(400).send({"status": 400, "description": 'No password provided'})
      return
    }
    console.log('collection name: ' + config.getUsersCollection())
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())      
        collection.find(
          {username: mapForPost.username, password: mapForPost.password,
          authorizedkey:{$exists:true}, authorizedkey: {$ne:null}})
          .project({_id: 0, authorizedkey: 1})
          .toArray((err, result) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.send(result)
          }
        })
        db.close()
      }
    }) 
  },
  async updateUser(req, res) {
    console.log('someone trying to update user')
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   
      console.log('No authorized key provided')
      res.status(400).send({"status": 400, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapFound = await findAuthKey(mapForPost.authorizedkey) 
    console.log(`mapFound's issuccess: ${mapFound.issuccess}`)
    if (mapFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapFound.errmsg})
      return
    }
    console.log(`mapFound's isexist: ${mapFound.isexist}`)
      if (mapFound.isexist === false ) {
        res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }  
    mongoClient.connect(config.getConnectionUri(), (err, db) => {
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())
        req.body.modifieddt = new Date()      
        collection.findOneAndUpdate({'authorizedkey': mapForPost.authorizedkey},
        {$set: req.body},
        {},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"User data update successfully"})
          }
        })
        db.close()
      }
    }) 
  },
  async removeUser(req, res) {
    console.log('someone going to delete the user')
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   
      console.log('No authorized key provided')
      res.status(400).send({"status": 400, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapFound = await findAuthKey(mapForPost.authorizedkey) 
    console.log(`mapFound's issuccess: ${mapFound.issuccess}`)
    if (mapFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapFound.errmsg})
      return
    }
    console.log(`mapFound's isexist: ${mapFound.isexist}`)
    if (mapFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }  
    mongoClient.connect(config.getConnectionUri(), (err, db) => {
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())      
        collection.deleteOne({'authorizedkey': mapForPost.authorizedkey},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"User delete successfully"})
          }
        })
        db.close()
      }
    })
  },
  async bookmarkFilm(req, res) {
    console.log('someone going to bookmark the film')
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) { 
      console.log('No authorized key provided')
      res.status(400).send({"status": 400, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapUserFound = await findAuthKey(mapForPost.authorizedkey) 
    console.log(`mapUserFound's issuccess: ${mapUserFound.issuccess}`)
    if (mapUserFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapUserFound.errmsg})
      return
    }
    console.log(`mapUserFound's isexist: ${mapUserFound.isexist}`)
    if (mapUserFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }
    console.log(`mapUserFound's bookmark: ${mapUserFound.bookmark}`)
    const imdbid = req.params.imdbid
    //check whether imdbid is exist
    let mapFilmFound = await findImdbId(imdbid)
    console.log(`mapFilmFound's issuccess: ${mapFilmFound.issuccess}`)
    if (mapFilmFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapFilmFound.errmsg})
      return
    }
    console.log(`mapFilmFound's isexist: ${mapFilmFound.isexist}`)
    if (mapFilmFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Film Not Exist"})
      return
    }  
    let lstbookmark = mapUserFound.bookmark
    let foundidx = lstbookmark.indexOf(imdbid)
    if (foundidx === -1){
      lstbookmark.push(imdbid) //bookmark
    } else {
      lstbookmark.splice(foundidx, 1) //unbookmark
    }
    mongoClient.connect(config.getConnectionUri(), (err, db) => {
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())      
        const obj = {
          modifieddt : new Date(),
          bookmark: lstbookmark
        }      
        collection.findOneAndUpdate({'authorizedkey': mapForPost.authorizedkey},
        {$set: obj},
        {},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"Bookmark data update successfully"})
          }
        })
        db.close()
      }
    })
  }, 
  async rateFilm(req, res) {
    console.log('someone going to rate the film')
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) { 
      console.log('No authorized key provided')
      res.status(400).send({"status": 400, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapUserFound = await findAuthKey(mapForPost.authorizedkey) 
    console.log(`mapUserFound's issuccess: ${mapUserFound.issuccess}`)
    if (mapUserFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapUserFound.errmsg})
      return
    }
    console.log(`mapUserFound's isexist: ${mapUserFound.isexist}`)
    if (mapUserFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }
    console.log(`mapUserFound's bookmark: ${mapUserFound.bookmark}`)
    const imdbid = req.params.imdbid
    //check whether imdbid is exist
    let mapFilmFound = await findImdbId(imdbid)
    console.log(`mapFilmFound's issuccess: ${mapFilmFound.issuccess}`)
    if (mapFilmFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapFilmFound.errmsg})
      return
    }
    console.log(`mapFilmFound's isexist: ${mapFilmFound.isexist}`)
    if (mapFilmFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Film Not Exist"})
      return
    }  
    let lstrate = mapUserFound.rate
    let foundidx = lstrate.map( function(elem) { return elem.filmid }).indexOf(imdbid)
    if (foundidx === -1) {
      // imdbid rate is not found, then push a new one
      lstrate.push( {filmid: imdbid, filmrate: mapForPost.rate} )
    } else {
      // imdbid rate is found, then replace by new one
      lstrate.splice(foundidx, 1, {filmid: imdbid, filmrate: mapForPost.rate})
    }
    mongoClient.connect(config.getConnectionUri(), (err, db) => {
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())      
        const obj = {
          modifieddt : new Date(),
          rate: lstrate
        }      
        collection.findOneAndUpdate({'authorizedkey': mapForPost.authorizedkey},
        {$set: obj},
        {},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"Rate data update successfully"})
          }
        })
        db.close()
      }
    })
  },
  listUsers(req, res) {
    console.log(`Someone request all user(s)`)
    mongoClient.connect(config.getConnectionUri(),
      (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getUsersCollection())
        collection.find({}).toArray((err, result) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.send(result)
          }
        })
        db.close()
      }
    })
  }
}

/**
 * internal function - find whether provided authrized key is exist
 * @param {string} authkey - authrized key of user.
 * @return {boolean} issuccess, {boolean} isexist or {string} errmsg
 */
function findAuthKey(authkey){
  return mongoClient.connect(config.getConnectionUri(),
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then( (client) => {
      return client.db(config.getDatabaseName())
    })
    .then( (db) => {
      let lsttemp = db.collection(config.getUsersCollection()).find({authorizedkey: authkey}).toArray()
      //db.close()
      return lsttemp      
    })
    .then( (lst) => {
      if (lst.length > 0 ) {
        let lstbookmark = lst[0].bookmark
        let lstrate = lst[0].rate
        let result_1 = {issuccess: true, isexist: true, createdt: lst[0].createdt, role: lst[0].role }
        if (lstbookmark === undefined) {
          result_1.bookmark = []
        } else {
          result_1.bookmark = lstbookmark
        }
        if (lstrate === undefined ) {
          result_1.rate = []
        } else {
          result_1.rate = lstrate
        }
        return result_1
      } else {
        return {issucess: true, isexist: false}
      }
    })
    .catch( (err) => {
      return {issuccess: false, errmsg: err}
    })
}

/**
 * internal function - find whether provided imdbID is exist
 * @param {string} imdb_id - imdbId of film.
 * @return {boolean} issuccess, {boolean} isexist, {string} errmsg or {string} createdt
 */
function findImdbId(imdb_id){
  return mongoClient.connect(config.getConnectionUri(),
  { useNewUrlParser: true, useUnifiedTopology: true })
    .then( (client) => {
      return client.db(config.getDatabaseName())
    })
    .then( (db) => {
      let lsttemp = db.collection(config.getFilmsCollection()).find({imdbID: imdb_id}).toArray()
      //db.close()
      return lsttemp      
    })
    .then( (lst) => {
      if (lst.length > 0 ) {
        let cdt = lst[0].createdt
        return {'issuccess': true, 'isexist': true, 'createdt': cdt}
      } else {
        return {'issucess': true, 'isexist': false}
      }
    })
    .catch( (err) => {
      return {'issuccess': false, 'errmsg': err}
    })
}

module.exports = usersController