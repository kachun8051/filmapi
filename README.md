# Assignment of film api

   This API is written by node.js, express.js as server and using mongodb.client connecting to mongodb. Database called filmstore consist of 2 collections - film and user. The API achieves CRUD operation by POST, GET, UPDATE and DELETE. API is starteded by command "cd app" and "node app.js" in console. The workspace of this api is: [https://replit.com/@kcwong8051/myFilmstore](https://replit.com/@kcwong8051/myFilmstore) 

---
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

---
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

---
## Endpoints

Film endpoints are routed by (1)film and (2)user. 

The url structure is:
> ```https://<host name>/<route>/<endpoint>```
   
### film route

| Function | HTTP Method | Endpoint | Url example |
| ------ | ------ | ------ | ------ |
| 1. Search film info by keyword | GET | /infofilm/:keyword | https://myFilmstore.kcwong8051.repl.co/film/infofilm/king |
| 2. Add films by batch | POST | /imfilms | https://myFilmstore.kcwong8051.repl.co/film/imfilms |
| 3. Add one film | POST | /imfilm | https://myFilmstore.kcwong8051.repl.co/film/imfilm | 
| 4. Search film info by key-pair value | GET | /film/:key/:value | https://myFilmstore.kcwong8051.repl.co/film/film/Title/king |
| 5. List films info | GET | /list | https://myfilmstore.kcwong8051.repl.co/film/list |
| 6. Update one film | PUT | /updatefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/updatefilm/tt0455590 |
| 7. Remove one film | DELETE | /removefilm/:imdbid | https://myfilmstore.kcwong8051.repl.co/film/removefilm/tt0455590 |
   
### user route
   
| Function | HTTP Method | Endpoint | Url example |
| ------ | ------ | ------ | ------ |
| I. Add users by batch | POST | /applys | https://myFilmstore.kcwong8051.repl.co/user/applys |
| II. Add one user | POST | /apply | https://myFilmstore.kcwong8051.repl.co/user/apply |
| III. Login | POST | /auth | https://myFilmstore.kcwong8051.repl.co/user/auth |
| IV. Update user info | PUT | /update | https://myFilmstore.kcwong8051.repl.co/user/update |
| V. Remove user | DELETE | /removeuser | https://myFilmstore.kcwong8051.repl.co/user/removeuser |
| VI. Bookmark film by user | POST | /bookmarkfilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/bookmarkfilm/tt0455590 |
| VII. Rate film by user | POST | /ratefilm/:imdbid | https://myFilmstore.kcwong8051.repl.co/user/ratefilm/tt0455590 |
| VIII. List user(s) | GET | /list | https://myFilmstore.kcwong8051.repl.co/user/list |

---   
## Use Api scenario - implemented by [PostMan](https://www.postman.com/)
   
### 1. Search film info by keyword - film route
![Search](./screenshots/infofilm.png "infofilm")

### 2. Add films by batch - film route
![AddBatch](./screenshots/imfilms_1.png "imfilms_1")
![AddBatch](./screenshots/imfilms_2.png "imfilms_2")   
   
### 3. Add one film - film route
![AddFilm](./screenshots/imfilm.png "imfilm")

### 4. Search film info by key-pair value - film route
![SearchByKey](./screenshots/searchkeypairvalue.png "searchkeypairvalue")
   
### 5. List films info - film route
![ListFilms](./screenshots/filmlist.png "filmlist")

### 6. Update one film - film route
![UpdateFilm](./screenshots/updatefilm.png "updatefilm")
   
### 7. Remove one film - film route
![RemoveFilm](./screenshots/removefilm.png "removefilm")

### I. Add users by batch - user route
![AddBatch](./screenshots/usersapply_1.png "usersapply#1")
![AddBatch](./screenshots/usersapply_2.png "usersapply#2")
   
### II. Add one user - user route
![AddUser](./screenshots/userapply.png "userapply")
   
### III. Login - user route
![UserAuth](./screenshots/userauth.png "userauth")
   
### IV. Update user info
![UserUpdate](./screenshots/userupdate.png "userupdate")
   
### V. Remove user
![UserRemove](./screenshots/userremove.png "userremove")   
   
### VI. Bookmark film by user x 2 times
![UserBookmark](./screenshots/userbookmarkfilm_1.png "userbookmark#1")
![UserBookmark](./screenshots/userbookmarkfilm_2.png "userbookmark#2")
![UserBookmark](./screenshots/userbookmarkfilm_result.png "mongodb bookmark result")
   
### VII. Rate film by user x 2 times
![UserRateFilm](./screenshots/userratefilm_1.png "userrate#1")
![UserRateFilm](./screenshots/userratefilm_2.png "userrate#2")
![UserRateFilm](./screenshots/userratefilm_result.png "mongodb rate result")
   
### VIII. List user(s)
![UserList](./screenshots/userlist.png "user list")
   
## Video for demo
[![Watch the demo video](https://i.imgur.com/lYDH4nJ.png)](https://vimeo.com/557297022/4af159cdad)
[![Watch the demo video](https://i.imgur.com/wgFyWPU.png)](https://vimeo.com/557303528/a94fb63bbf)
   
## License

MIT

## About

Course: Professional Diploma in Cross-platform Applications Development (API)

Student: Wong Ka Chun

Date: 2021-07-23
