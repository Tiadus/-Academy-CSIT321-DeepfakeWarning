/**
 * Inserts a list of users into the APP_USER table in a batch operation.
 * This function uses a transaction to ensure that the entire batch insert
 * succeeds or fails as a unit, providing data consistency.
 * 
 * @param {Object} dbConnection - The database connection object.
 * @param {Array<Object>} userList - An array of user objects to insert. Each object should have:
 * - email: The user's email address.
 * - user_name: The user's name.
 * - avatar: A string representing the user's avatar.
 * - phone: The user's phone number.
 * - password: The user's hashed password.
 * 
 * @throws Will throw an error if the batch insert fails.
 */
async function batchInsertUsers(dbConnection, userList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryUser = 
        'INSERT INTO APP_USER (email, user_name, avatar, phone, user_password, modified_by) VALUES ?';

        // Format the data for batch insert
        const valueUser = 
        userList.map(item => 
            [
                item.email,
                item.user_name,
                item.avatar,
                item.phone,
                item.password,
                0
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

/**
 * Inserts a list of contacts into the CONTACT table in a batch operation.
 * This function uses a transaction to ensure that the entire batch insert
 * succeeds or fails as a unit, ensuring data consistency.
 * 
 * @param {Object} dbConnection - The database connection object.
 * @param {Array<Object>} contactList - An array of contact objects to insert. Each object should have:
 * - storer: The ID of the user who is storing the contact.
 * - stored: The ID of the user being stored as a contact.
 * 
 * @throws Will throw an error if the batch insert fails.
 */
async function batchInsertContacts(dbConnection, contactList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryContact = 
        'INSERT INTO CONTACT (storer_id, stored_id) VALUES ?';

        // Format the data for batch insert
        const valueContact = 
        contactList.map(item => 
            [
                item.storer,
                item.stored
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

/**
 * Inserts a list of call history records into the CALL_HISTORY table in a batch operation.
 * This function uses a transaction to ensure that all the records are inserted successfully,
 * or none at all in case of an error, preserving data consistency.
 * 
 * @param {Object} dbConnection - The database connection object.
 * @param {Array<Object>} historyList - An array of call history objects to insert. Each object contains:
 * - sender: The ID of the user who initiated the call.
 * - receiver: The ID of the user who received the call.
 * - callDate: The date of the call (in 'YYYY-MM-DD' format).
 * - status: The status of the call (e.g., completed, missed).
 * - deepfake: Indicator (e.g., 0 or 1) if deepfake detection was involved.
 * - room_id: A unique identifier for the call session.
 * 
 * @throws Will throw an error if the batch insert fails.
 */
async function batchCallHistory(dbConnection, historyList) {
    try {
        // Begin a transaction
        await dbConnection.beginTransaction();

        // Prepare the insert query
        const queryCallHistory = 
        'INSERT INTO CALL_HISTORY (sender, receiver, call_date, call_status, deepfake, room_id, modified_by) VALUES ?';

        // Format the data for batch insert
        const valueCallHistory = 
        historyList.map(item => 
            [
                item.sender,
                item.receiver,
                item.callDate,
                item.status,
                item.deepfake,
                item.room_id,
                0
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

/**
 * Inserts a list of educational content records into the EDUCATION table in a batch operation.
 * This function uses a transaction to ensure that all records are inserted successfully,
 * or none at all in case of an error, preserving data consistency.
 * 
 * @param {Object} dbConnection - The database connection object.
 * @param {Array<Object>} contentList - An array of educational content objects to insert. Each object contains:
 * - title: The title of the educational content.
 * - content: The detailed content/body associated with the title.
 * 
 * @throws Will throw an error if the batch insert fails.
 */
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