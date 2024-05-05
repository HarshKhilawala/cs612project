require("dotenv").config();
const express = require("express");
const client = require("./database.js");
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

client
  .connect()
  .then(() => {
    console.log("Database Connected!");
    app.listen(port, () => {
      console.log(`Server up and running on port ${port}!`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

// Verify JWT tokens to allow access
function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }

  let token = req.headers.authorization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }

  let payLoad = jwt.verify(token, "secret");
  if (!payLoad) {
    return res.status(401).send("Unauthorized request");
  }

  req.email = payLoad.subject;
  next();
}

app.get("/", (req, res) => {
//   client.query("SELECT * FROM cs612project.usermanagement", (err, result) => {
//     if (err) {
//       res.status(400).json({ Reason: "Error in DB" });
//     } else {
//       res.status(200).json(result.rows);
//     }
//   });

  res.send("Home!");
});


