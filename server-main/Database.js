const mysql = require('mysql2');
const config = require('./db_config');

const host = config.host;
const user = config.user;
const password = config.password;
const databaseName = config.databaseName;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password
});

const database = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: databaseName
});

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }).promise();

module.exports = {connection, database, pool};