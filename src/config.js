'use strict'
/** Class representing a Config */
module.exports = class config {

	/**
	 * Create a Config
	 */
	constructor() {
		this.mongo_username = 'dbUser'  // update your username
        this.mongo_password = 'QE5aWC4IUDVhhORo' // update your password
        this.database_name = 'filmstore' // Update your database name here
        this.filmscollection = 'film'
        this.userscollection = 'user'
        this.apikey = '8492cf8d'    
	}  

  getOmdbApikey(){
    return this.apikey;
  }

  getOmdbUri(){
    let uri = `http://www.omdbapi.com/?apikey=${this.apikey}`
    console.log('uri: ' + uri)
    return uri;
  }

  getMongoUsername(){
    return this.mongo_username;
  }

  getMongoPassword(){
    return this.mongo_password;
  }

  getConnectionUri(){
    return `mongodb+srv://${this.mongo_username}:${this.mongo_password}@vtccluster2021.c7w0l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  }

  getDatabaseName(){
    return this.database_name;
  }

  getFilmsCollection(){
    return this.filmscollection;
  }

  getUsersCollection(){
    return this.userscollection;
  }
}