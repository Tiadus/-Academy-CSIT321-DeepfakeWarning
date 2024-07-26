const {connection} = require('../Database.js');
const config = require('../db_config');

async function dropDatabase() {
    let mySQLServer = null;
    try {
        mySQLServer = connection
        await mySQLServer.promise().connect();
        
        const sql = `DROP DATABASE IF EXISTS ${config.databaseName}`;
        await mySQLServer.promise().query(sql);
        mySQLServer.end();
        mySQLServer = null;

        console.log(`Drop Database ${config.databaseName} Operation Completed!`);
    } catch(error) {
        console.log("Error When Dropping Database: " + error.stack);
    } finally {
        if (mySQLServer !== null) {
            mySQLServer.end();
        }
    }
}

dropDatabase();