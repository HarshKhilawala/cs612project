const { Pool, Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "cs612project",
});

module.exports = client;
