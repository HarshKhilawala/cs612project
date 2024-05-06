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


// GET Requests
app.get("/", function(req, res){
});

app.get("/home", function(req, res){
  
});

app.get("/login", function(req, res){

});

app.get("/register", function(req, res){
  
});





// POST Requests
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  console.log(req.body);

  client.query(
    `SELECT * from ecommerce.users where email = $1`,
    [email],
    (err, result) => {
      if (err) {
        res.status(400).json({ Reason: "Error in DB" });
      } else if (result.rows.length === 0) {
        res.send("User does not exist.");
      } else {
        let userData = result.rows[0];
        bcrypt.compare(password, userData.password).then((result) => {
          if (result) {
            console.log("Login Successful!");
            res
              .status(200)
              .json({ status: true, message: "valid user" });
          } else {
            console.log("Login Failed! Incorrect Username or password");
            res.status(401).json({ status: false, message: "invalid user" });
          }
        });
      }
    }
  );
});;

app.post("/register", (req, res) => {
  let { fullname, email, password } = req.body;
  console.log(req.body);

  bcrypt.hash(password, 10).then((hashedPassword) => {
    client.query(
      `INSERT INTO ecommerce.users(name, email, password) VALUES($1, $2, $3)`,
      [fullname, email, hashedPassword],
      (err, result) => {
        if (err) {
          res.status(400).json({ Reason: "DB Error" });
        } else {
          res
            .status(200)
            .json({ Reason: "User Inserted Successfully."});
        }
      }
    );
  });
});