# Assignment of film api

   This API is written by node.js, express.js as server and using mongodb.client connecting to mongodb. Database called filmstore consist of 2 collections - film and user. The API achieves CRUD operation by POST, GET, UPDATE and DELETE. API is starteded by command "cd app" and "node app.js" in console. The workspace of this api is: [https://replit.com/@kcwong8051/myFilmstore](https://replit.com/@kcwong8051/myFilmstore) 

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

Film endpoints are routed by (1)film and (2)user. 

The url structure is:
> ```https://<host name>/<route>/<endpoint>```
   
### film route

| Function | HTTP Method | Endpoint | Url example |
| ------ | ------ | ------ | ------ |
| Search film info by keyword | GET | /infofilm/:keyword | https://myFilmstore.kcwong8051.repl.co/film/infofilm/king |
| Add films by batch | POST | /imfilms | https://myFilmstore.kcwong8051.repl.co/film/imfilms |
| Add one film | POST | /imfilm | https://myFilmstore.kcwong8051.repl.co/film/imfilm | 
| Search film info by key-pair value | GET | /film/:key/:value | https://myFilmstore.kcwong8051.repl.co/film/film/Title/king |
| List films info | GET | /list | https://myfilmstore.kcwong8051.repl.co/film/list |
| Update one film | PUT | /updatefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/updatefilm/tt0455590 |
| Remove one film | DELETE | /removefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/removefilm/tt0455590 |
   
### user route
   
| Function | HTTP Method | Endpoint | Url example |
| ------ | ------ | ------ | ------ |
| Add users by batch | POST | /applys | https://myFilmstore.kcwong8051.repl.co/user/applys |
| Add one user | POST | /apply | https://myFilmstore.kcwong8051.repl.co/user/apply |
| Login | POST | /auth | https://myFilmstore.kcwong8051.repl.co/user/auth |
| Update user info | PUT | /update | https://myFilmstore.kcwong8051.repl.co/user/update |
| Remove user | DELETE | /removeuser | https://myFilmstore.kcwong8051.repl.co/user/removeuser |
| Bookmark film by user | POST | /bookmarkfilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/bookmarkfilm/tt0455590 |
| Rate film by user | POST | /ratefilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/ratefilm/tt0455590 |
| List user(s) | GET | /list | https://myFilmstore.kcwong8051.repl.co/user/list |

