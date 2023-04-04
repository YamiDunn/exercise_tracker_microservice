const { nanoid } = require("nanoid");
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

const user = [{ username: "TestMain, _id", _id: 00000000000000000000 }];
const getTime = (date) => {
  let dateObj;
  let validDate =
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(
      date
    );
  if (date) {
    if (validDate) {
      dateObj = new Date(date);
      dateObj =
        dateObj.getFullYear() +
        "-" +
        (dateObj.getMonth() + 1) +
        "-" +
        (dateObj.getDate() + 1);
      console.log("you are here", dateObj);
    } else {
      console.log("invalid date input");
    }
  } else {
    date = new Date();
    dateObj =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
  return dateObj;
};

app
  .route("/api/users")
  .post((req, res, next) => {
    let userData = req.body.username;
    let gId = nanoid(20);
    var cUser = { username: userData, _id: gId };
    user.push(cUser);
    res.json({ username: userData, _id: gId });
    next();
  })
  .get((req, res) => {
    res.json(user);
  });

app.route("/api/users/:_id/exercises").post((req, res) => {
  let uid = req.body[":_id"];
  let desc = req.body.description;
  let dur = req.body.duration;
  let date = req.body.date;

  try {
    let index = user.findIndex((el) => el._id == uid);
    if (index) {
      user[index].description = desc;
      user[index].duration = dur;
      let dateObj = getTime(date);
      user[index].date = dateObj;
      res.json(user[index]);
    } else {
      res.json(user);
      console.log("id is not in the temp");
    }
  } catch (err) {
    console.log(err);
    res.json("id not founded, server error");
  }
});
