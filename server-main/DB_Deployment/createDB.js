const fs = require('fs').promises;

/**
 * Connects to a MySQL server and creates a specified database if it does not already exist.
 * @param {Object} mySQLServer - The MySQL server connection object.
 * @param {string} databaseName - The name of the database to be created.
 * @returns {Promise<void>} A promise that resolves when the database is created successfully or rejects with an error.
 */
async function createDatabase(mySQLServer, databaseName) {
    try {
        // SQL code to create the database
        const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;

        // Connect to the MySQL server
        await mySQLServer.promise().connect();

        // Create the database
        await mySQLServer.promise().query(createDatabaseSql);

        console.log('Database created successfully');
    } catch (error) {
        throw error;
    }
}

/**
 * Reads SQL commands from a specified file and executes them to create tables in the database.
 * @param {Object} dbConnection - The database connection object.
 * @param {string} filePath - The path to the SQL file containing the table creation commands.
 * @returns {Promise<void>} A promise that resolves when all tables are created successfully or rejects with an error.
 */
async function createTables (dbConnection, filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const queries = data.split(/;\r?\n/);
  
      for (let i = 0; i < queries.length; i++) {
        await dbConnection.query(queries[i]);
      }
  
      console.log('Tables created successfully!');
    } catch (error) {
      throw error;
    }
  }

module.exports = {createDatabase, createTables};