const {createDatabase, createTables} = require('./createDB.js');
const {generateUsers, generateContacts, generateCallHistory, generateEducation} = require('./dataGeneration.js');
const {batchInsertUsers, batchInsertContacts, batchCallHistory, batchInsertEducation} = require('./insertDB.js');

const filePath = './DB_CREATE.sql';
const {connection, database} = require('../Database.js');

async function deployDatabase() {

    let mySQLServer = null;
    let db = null;
    let databaseConnection = null;

    try {
        mySQLServer = connection
        
        await createDatabase(mySQLServer, 'CSIT321');
        mySQLServer.end();
        mySQLServer = null;

        db = database

        databaseConnection = await db.promise().getConnection();
        await createTables(databaseConnection, filePath);

        const userList = await generateUsers();
        await batchInsertUsers(databaseConnection, userList);

        const contactList = await generateContacts();
        await batchInsertContacts(databaseConnection, contactList);

        const historyList = generateCallHistory();
        await batchCallHistory(databaseConnection, historyList);

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