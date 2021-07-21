'use strict'

const Config = require('./config')
const mongoClient = require("mongodb").MongoClient
const fetch = require("node-fetch")
const config = new Config()

const responseStatus = {
	'ok': 200,
	'created': 201,
	'notModified': 304,
	'notFound': 404,
  'noContent': 204
}

/**
 * internal function 
 * @param {string} _search - the keyword input by user
 * @return {object} object containing the film list 
 */
function getMoviesFromApiAsync(_search) {
  console.log('searching...'+_search)
  let uri_1 = config.getOmdbUri() + '&s=' + _search
  console.log('uri: ' + uri_1)
  let res = fetch(uri_1)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.Search;
    })
    .catch((error) => {
      console.error(error);
    });
  return res;
}
/**
 * internal function - find whether provided authrized key is exist 
 * @param {string} authkey - authrized key of user.
 * @return {boolean} issuccess, {boolean} isexist, {string} errmsg or {string} role of user
 */
function find_Auth_Key(authkey){
  return mongoClient.connect(config.getConnectionUri())
    .then( (client) => {
      return client.db(config.getDatabaseName())
    })
    .then( (db) => {
      let lsttemp = db.collection(config.getUsersCollection()).find({authorizedkey: authkey}).toArray()
      //db.close()
      return lsttemp      
    })
    .then( (lst) => {
      if (lst === undefined ){
        return {issuccess: false, errmsg: 'list is undefined'}  
      }
      if (lst.length > 0 ) {
        let userrole = lst[0].role
        return {issuccess: true, isexist: true, role: userrole}
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
function find_Imdb_Id(imdb_id){
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
        return { issuccess : true, isexist : true, createdt: cdt}
      } else {
        return {issucess: true, isexist: false}
      }
    })
    .catch( (err) => {
      return {issuccess: false, errmsg: err}
    })
}

const filmsController = {
  
  testIt(req, res){
    if (res.statusCode === responseStatus.ok) {
      res.send('Testing...\nGlad! You are connecting the api (Film)')
    } else {
      res.send({"status": res.status, "description":"Film not connected"});
    }    
  },
  searchByKeyword(req, res){
		console.log(`Someone request by search keyword`);
    const keyword = req.params.keyword;
    console.log('keyword: ' + keyword);
		getMoviesFromApiAsync(keyword)
		.then((lstres) => {
			if (lstres === undefined || lstres === null) 
			{
				res.send({"status":500, "description":"search error!"})
			} else {
        if (lstres.length === 0)
			  {
				  res.send({"status":204, "description":"search nothing!"})
			  } else {
          res.send({"status":200, "description":lstres});
        }
      }
		})
		.catch((error) => { console.error(error)});
	}, 
  async addManyFilms(req, res) {
    console.log('someone going to add many films')
    let mapForPost = req.body    
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   
      console.log('No authorized key provided')
      res.status(401).send({"status": 401, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapFound = await find_Auth_Key(mapForPost.authorizedkey) 
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
    if (mongoClient === undefined || mongoClient === null) {
      let errmsg = 'mongoClient is undefined!' 
      console.log(errmsg)
      res.status(500).send({"status": 500, "description": errmsg})
      return
    }
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())
        let lstObj = mapForPost.filmlist
        if (lstObj === undefined){
          res.status(400).send({"status": 400, "description": "Content Not Exist"})
          return
        } 
        let lstObj_1 = []
        lstObj.forEach(
          (elem) => {
            //only 5 fields required  
            let obj_1 = {
              Title : elem.Title,
              Year : elem.Year,
              imdbID : elem.imdbID,
              Type : elem.Type,
              Poster : elem.Poster,
              createdt : new Date()
            }
            lstObj_1.push(obj_1)    
          }
        )        
        collection.insertMany(lstObj_1, (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description": "Films  insert successfully (Bulk)"})
          }
        })
        db.close()
      }
    })
  },
  async addNewFilm(req, res){
    console.log('someone going to add a new film')
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   
      console.log('No authorized key provided')
      res.status(401).send({"status": 401, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapFound = await find_Auth_Key(mapForPost.authorizedkey) 
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
    if (mongoClient === undefined || mongoClient === null) {
      let errmsg = 'mongoClient is undefined!' 
      console.log(errmsg)
      res.status(500).send({"status": 500, "description": errmsg})
      return
    }
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())  
        //only 5 fields required  
        const obj = {
          Title : mapForPost.Title,
          Year : mapForPost.Year,
          imdbID : mapForPost.imdbID,
          Type : mapForPost.Type,
          Poster : mapForPost.Poster,
          createdt : new Date()
        }
        collection.insertOne(obj, (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description": "Data insert successfully"})
          }
        })
        db.close()
      }
    })
  },
  searchByKeyPairValue(req, res){
    const mykey = req.params.key
    const myval = req.params.val
    console.log(`Someone query the film with key: ${mykey} and value: ${myval}`)
  
    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())      
        collection.find({[mykey]: {$regex: new RegExp(myval, 'i')}})
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
  listAllFilms(req, res) {
    console.log(`Someone request all film(s)`)

    mongoClient.connect(config.getConnectionUri(), (err, db)=>{
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())
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
  },
  async deleteTheFilm(req, res){
    const imdbid = req.params.imdbid
    console.log(`someone going to delete the film with imdbID: ${imdbid}`)
    //check whether imdbid is exist
    let mapFilmFound = await find_Imdb_Id(imdbid)
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
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {   console.log('No authorized key provided')
      res.status(401).send({"status": 401, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    //check the authorized key 
    let mapUserFound = await find_Auth_Key(mapForPost.authorizedkey) 
    console.log(`mapFound's issuccess: ${mapUserFound.issuccess}`)
    if (mapUserFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapUserFound.errmsg})
      return
    }
    console.log(`mapFound's isexist: ${mapUserFound.isexist}`)
    if (mapUserFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "Not Exist"})
      return
    }  
    if (mapUserFound.role !== 'staff') {
      res.status(403).send({"status": 403, "description": "restrict to access"})
      return
    }
    mongoClient.connect(config.getConnectionUri(), 
      (err, db)=>{
        if(err){
          console.log(err)
          res.status(500).send({"status": 500, "description": err})
        } else {
          const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())      
          collection.deleteOne({'imdbID': imdbid},
            (err) => {
              if(err) {
                res.status(500).send({"status":500, "description":err})
              } else {
                res.status(201).send({"status":201, "description":"Data delete successfully"})
              }
            })
          db.close()
        }
      })      
  },
  async updateTheFilm(req, res) {
    const imdbid = req.params.imdbid
    console.log(`someone going to update the film with imdbID: ${imdbid}`)
    //check whether imdbid is exist
    let mapFilmFound = await find_Imdb_Id(imdbid)
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
    let mapForPost = req.body
    if (mapForPost.authorizedkey === undefined || mapForPost.authorizedkey === null ) {     console.log('No authorized key provided')
      res.status(401).send({"status": 401, "description": 'No authorized key provided'})
      return
    } 
    console.log('authorized key: ' + mapForPost.authorizedkey)
    let mapUserFound = await find_Auth_Key(mapForPost.authorizedkey) 
    console.log(`mapUserFound's issuccess: ${mapUserFound.issuccess}`)
    if (mapUserFound.issuccess === false ) {
      res.status(400).send({"status": 400, "description": mapUserFound.errmsg})
      return
    }
    console.log(`mapUserFound's isexist: ${mapUserFound.isexist}`)
    if (mapUserFound.isexist === false ) {
      res.status(400).send({"status": 400, "description": "User Not Exist"})
      return
    }  
    console.log('role: ' + mapUserFound.role)
    if (mapUserFound.role !== 'staff') {
      res.status(403).send({"status": 403, "description": "restrict to access"})
      return
    }
    mongoClient.connect(config.getConnectionUri(), (err, db) => {
      if(err){
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
      } else {
        const collection = db.db(config.getDatabaseName()).collection(config.getFilmsCollection())
        //only 6 original fields + modifieddt required  
        const obj = {
          Title : mapForPost.Title,
          Year : mapForPost.Year,
          imdbID : mapForPost.imdbID,
          Type : mapForPost.Type,
          Poster : mapForPost.Poster,
          createdt : mapFilmFound.createdt,
          modifieddt : new Date()
        }
        collection.findOneAndUpdate({'imdbID': imdbid},
        {$set: obj},
        {},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"Film data update successfully"})
          }
        })
        db.close()
      }
    }) 
  }
}

module.exports = filmsController