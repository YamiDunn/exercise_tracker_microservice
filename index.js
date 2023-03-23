const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const user = [{ username: String, _id: Number }];
var index = 0;

app.route("/api/users").post((req, res, next) => {
  let userData = req.body.username;
  
  user.push({username: userData, _id: index+1});
  index = index+1;
  res.json(user);
  next
}).get((req, res) => {
  
  res.json(user);
});


