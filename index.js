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

const user = [];
const getTime = (date) => {
  let dateObj;
  let tempDate;
  let validDate =
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/.test(
      date
    );

  if (date) {
    if (validDate) {
      tempDate = new Date(date);
      tempDate.setDate(tempDate.getDate() + 1);
      dateObj = tempDate.toDateString();
    } else {
      console.log("invalid date input");
    }
  } else {
    date = new Date();
    dateObj = date.toDateString();
  }
  return dateObj;
};

app.route("/api/users").post((req, res) => {
  let userData = String(req.body.username);
  let gId = nanoid(20);
  var cUser = { username: userData, _id: gId };
  user.push(cUser);
  res.json({ username: userData, _id: gId });
});

app.get("/api/users", (req, res) => {
  res.json(user);
});

app.route("/api/users/:_id/exercises").post((req, res) => {
  let uid = req.body[':_id'];
  let desc = req.body.description;
  let dur = Number(req.body.duration);
  let date = req.body.date;
  console.log(uid, desc, dur, date);
  try {
    let index = user.findIndex((el) => el._id == uid);
    console.log(index);
    if (index) {
      user[index].description = desc;
      user[index].duration = dur;
      let dateObj = getTime(date);
      user[index].date = dateObj;
      res.json({
        _id: user[index]._id,
        username: user[index].username,
        date: user[index].date,
        duration: user[index].duration,
        description: user[index].description
      });
    } else if (index == 0) {
      let firstObj = 0;
      user[firstObj].description = desc;
      user[firstObj].duration = dur;
      let dateObj = getTime(date);
      user[firstObj].date = dateObj;
      res.json(user[firstObj]);
    }
    else {
      console.log("Id not found");
    }
  } catch (err) {
    console.log(err);
    res.json("id not founded, server error");
  }
});
