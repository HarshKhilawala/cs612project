const { Pool, Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST,
  user: "root",
  port: 5432,
  password: "root",
  database: "cs612project",
});

module.exports = client;
