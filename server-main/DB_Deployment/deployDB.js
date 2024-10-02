const {createDatabase, createTables} = require('./createDB.js');
const {generateUsers, generateContacts, generateCallHistory, generateEducation} = require('./dataGeneration.js');
const {batchInsertUsers, batchInsertContacts, batchCallHistory, batchInsertEducation} = require('./insertDB.js');

const filePath = './DB_CREATE.sql';
const {connection, database} = require('../Database.js');

/**
 * Deploys the database by performing the following steps:
 * 1. Creates a new database named 'CSIT321' if it doesn't exist.
 * 2. Creates necessary tables based on SQL schema provided in a file.
 * 3. Generates and inserts initial data for users, contacts, call history, and educational content.
 * 
 * The function handles the entire database deployment process, managing connections, transactions,
 * and rollback mechanisms in case of errors.
 */
async function deployDatabase() {

    let mySQLServer = null; // MySQL server connection for creating the database
    let db = null; // Database connection for performing operations
    let databaseConnection = null; // Specific connection object for interacting with the database

    try {
        // Step 1: Initialize connection to MySQL server
        mySQLServer = connection
        
        await createDatabase(mySQLServer, 'CSIT321');
        mySQLServer.end(); // Close the MySQL server connection after creating the database
        mySQLServer = null; // Set it to null as it's no longer needed

        // Step 2: Connect to the newly created 'CSIT321' database
        db = database

        databaseConnection = await db.promise().getConnection(); // Get the database connection

        // Step 3: Create the necessary tables by executing SQL file commands
        await createTables(databaseConnection, filePath); // `filePath` should point to the SQL schema file

        // Step 4: Generate and insert user data into the database
        const userList = await generateUsers();
        await batchInsertUsers(databaseConnection, userList);

        // Step 5: Generate and insert contact data into the database
        const contactList = await generateContacts();
        await batchInsertContacts(databaseConnection, contactList);

        // Step 6: Generate and insert call history data into the database
        const historyList = generateCallHistory();
        await batchCallHistory(databaseConnection, historyList);

        // Step 7: Generate and insert educational content into the database
        const contentList = await generateEducation();
        await batchInsertEducation(databaseConnection, contentList);

        await databaseConnection.commit();
    } catch(error) {
        console.error('Error deploying database: ' + error.stack);
        if (databaseConnection !== null) {
            databaseConnection.rollback();
        }
    } finally {
        if (mySQLServer !== null) {
            mySQLServer.end();
        }

        if (db !== null) {
            db.end();
        }

        if (databaseConnection !== null) {
            databaseConnection.release();
        }
    }
}

deployDatabase();