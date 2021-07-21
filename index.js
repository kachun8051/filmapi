const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Hello World");
})

//creating a webserver :: 3000
app.listen(3000);