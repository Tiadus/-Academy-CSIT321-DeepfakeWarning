const fs = require('fs').promises;

// Connect to the MySQL server and execute the SQL code
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