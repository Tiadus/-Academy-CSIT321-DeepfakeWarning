async function batchInsertUsers(dbConnection, userList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryUser = 
        'INSERT INTO APP_USER (email, user_name, avatar, phone, user_password) VALUES ?';

        // Format the data for batch insert
        const valueUser = 
        userList.map(item => 
            [
                item.email,
                item.user_name,
                item.avatar,
                item.phone,
                item.password,
            ]);

        // Execute the batch insert query
        await dbConnection.query(queryUser, [valueUser]);

        console.log('Batch insert users successful');
    } catch (error) {
        // Rollback the transaction if an error occurred
        console.error('Batch insert users failed:');
        throw error;
    }
}

async function batchInsertContacts(dbConnection, contactList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryContact = 
        'INSERT INTO CONTACT (storer_id, stored_id, blocked) VALUES ?';

        // Format the data for batch insert
        const valueContact = 
        contactList.map(item => 
            [
                item.storer,
                item.stored,
                item.blocked,
            ]);

        // Execute the batch insert query
        await dbConnection.query(queryContact, [valueContact]);

        console.log('Batch insert contacts successful');
    } catch (error) {
        // Rollback the transaction if an error occurred
        console.error('Batch insert contacts failed:');
        throw error;
    }
}

async function batchCallHistory(dbConnection, historyList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryCallHistory = 
        'INSERT INTO CALL_HISTORY (sender, receiver, call_status, deepfake) VALUES ?';

        // Format the data for batch insert
        const valueCallHistory = 
        historyList.map(item => 
            [
                item.sender,
                item.receiver,
                item.status,
                item.deepfake,
            ]);

        // Execute the batch insert query
        await dbConnection.query(queryCallHistory, [valueCallHistory]);

        console.log('Batch insert call history successful');
    } catch (error) {
        // Rollback the transaction if an error occurred
        console.error('Batch insert call history failed');
        throw error;
    }
}

async function batchInsertEducation(dbConnection, contentList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryEducation = 
        'INSERT INTO EDUCATION (title, content) VALUES ?';

        // Format the data for batch insert
        const valueEducation = 
        contentList.map(item => 
            [
                item.title,
                item.content
            ]);

        // Execute the batch insert query
        await dbConnection.query(queryEducation, [valueEducation]);

        console.log('Batch insert educational content successful');
    } catch (error) {
        // Rollback the transaction if an error occurred
        console.error('Batch insert educational content failed:');
        console.log(contentList);
        throw error;
    }
}

module.exports = {batchInsertUsers, batchInsertContacts, batchCallHistory, batchInsertEducation}