# Assignment of film api

   This API is written by node.js, express.js as server and using mongodb.client connecting to mongodb. Database called filmstore consist of 2 collections - film and user. The API achieves CRUD operation by POST, GET, UPDATE and DELETE. API is starteded by command "cd app" and "node app.js" in console.

## Folder structure

```
+-- src
|   +-- app.js
|   +-- config.js
|   +-- filmcontroller.js
|   +-- filmroute.js
|   +-- usercontroller.js
|   +-- userroute.js
|   +-- Readme.md
```

## Database (filmstore) structure

### Collection (film)
1. _id: ObjectId 
2. Title: String
3. Year: String
4. imdbID: String
5. Type: String
6. Poster: String
7. createdt: Date

### Collection (user)
1. _id: ObjectId
2. username: String
3. password: String
4. email: String
5. role: String
6. firstname: String
7. surname: String
8. authorizedkey: String
9. createdt: Date
10. bookmark: Array
11. modifieddt: Date
12. rate: Array

## Endpoints

Film endpoints are routed by film and user. 

The url structure is:
> ```https://<host name>/<route>/<endpoint>```   

| Function | HTTP Method | Route (film) | Endpoint | Url example |
| ------ | ------ | ------ | ------ | ------ |
| Search film info by keyword | GET | film | /infofilm/:keyword | https://myFilmstore.kcwong8051.repl.co/film/infofilm/king |
| Add films by batch | POST | film | /imfilms | https://myFilmstore.kcwong8051.repl.co/film/imfilms |
| Add one film | POST | film | /imfilm | https://myFilmstore.kcwong8051.repl.co/film/imfilm | 
| Search film info by key-pair value | GET | film | /film/:key/:value | https://myFilmstore.kcwong8051.repl.co/film/film/Title/king |
| List films info | GET | film | /list | https://myfilmstore.kcwong8051.repl.co/film/list |
| Update one film | PUT | film | /updatefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/updatefilm/tt0455590 |
| Remove one film | DELETE | film | /removefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/removefilm/tt0455590 |
   
| Function | HTTP Method | Route (user) | Endpoint | Url example |
| ------ | ------ | ------ | ------ | ------ |
| Add users by batch | POST | user | /applys | https://myFilmstore.kcwong8051.repl.co/user/applys |
| Add one user | POST | user | /apply | https://myFilmstore.kcwong8051.repl.co/user/apply |
| Login | POST | user | /auth | https://myFilmstore.kcwong8051.repl.co/user/auth |
| Update user info | PUT | user | /update | https://myFilmstore.kcwong8051.repl.co/user/update |
| Remove user | DELETE | user | /removeuser | https://myFilmstore.kcwong8051.repl.co/user/removeuser |
| Bookmark film by user | POST | user | /bookmarkfilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/bookmarkfilm/tt0455590 |
| Rate film by user | POST | user | /ratefilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/ratefilm/tt0455590 |
| List user(s) | GET | user | /list | https://myFilmstore.kcwong8051.repl.co/user/list |

