class Call_History {
    /**
     * Inserts a call history record into the CALL_HISTORY table.
     *
     * @param {number} sender - The ID of the user initiating the call.
     * @param {number} receiver - The ID of the user receiving the call.
     * @param {Date} call_date - The date and time of the call.
     * @param {string} call_status - The status of the call (e.g., 'completed', 'missed').
     * @param {boolean} deepfake - Indicates whether the call involved deepfake technology.
     * @param {string} room_id - The ID of the room used for the call.
     * @returns {Promise<number>} - Returns the ID of the inserted call history record.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async insertCallHistory(sender, receiver, call_date, call_status, deepfake, room_id) {
        const {pool} = require('../Database.js');
        let connection = null;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const sqlRegisterCallHistory = 'INSERT INTO CALL_HISTORY (sender, receiver, call_date, call_status, deepfake, room_id, modified_by) VALUES(?, ?, ?, ?, ?, ?, ?)';
            const sqlRegisterCallHistoryValue = [sender, receiver, call_date, call_status, deepfake, room_id, sender];
            const callHistoryRegisterResult = await connection.query(sqlRegisterCallHistory, sqlRegisterCallHistoryValue);
            
            connection.commit();
            connection = null;

            return callHistoryRegisterResult[0].insertId;
        } catch (dbError) {
            if (connection !== null) {
                connection.rollback();
            }

            console.log("Error While Inserting Call History: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        } finally {
            if (connection !== null) {
                connection.release();
            }
        }
    }

    /**
     * Updates the status of a call in the CALL_HISTORY table.
     *
     * @param {string} call_status - The new status of the call (e.g., 'completed', 'missed').
     * @param {number} modified_by - The ID of the user making the update.
     * @param {string} room_id - The ID of the room associated with the call.
     * @returns {Promise<void>} - Returns nothing if the update was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async updateCallHistory(call_status,  modified_by, room_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'UPDATE CALL_HISTORY SET call_status = ?, modified_by = ? WHERE room_id = ?';
            const queryValue = [call_status,  modified_by, room_id]
            const sqlUpdateResult = await pool.query(sql,queryValue);
            return;
        } catch (dbError) {
            console.log("Error When Updating Call History: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    /**
     * Flags a call in the CALL_HISTORY table as involving deepfake technology.
     *
     * @param {boolean} deepfake - Indicates whether the call involves deepfake technology.
     * @param {number} modified_by - The ID of the user making the update.
     * @param {string} room_id - The ID of the room associated with the call.
     * @returns {Promise<void>} - Returns nothing if the update was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async flagCallHistory(deepfake, modified_by, room_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'UPDATE CALL_HISTORY SET deepfake = ?, modified_by = ? WHERE room_id = ?';
            const queryValue = [deepfake,  modified_by, room_id];
            const sqlUpdateResult = await pool.query(sql,queryValue);
            return;
        } catch (dbError) {
            console.log("Error When Updating Call History: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    /**
     * Retrieves the incoming call history for a specific user from the CALL_HISTORY table.
     *
     * @param {number} user_id - The ID of the user for whom to retrieve incoming call history.
     * @returns {Promise<Array>} - Returns an array of call history records for the specified user.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async getIncomingCallHistory(user_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone, call_date, call_status, deepfake, CALL_HISTORY.created_at"
            const sql2 = "FROM CALL_HISTORY JOIN APP_USER ON CALL_HISTORY.sender = APP_USER.user_id"
            const sql3 = "WHERE receiver = ?";
            const sql4 = "ORDER BY CALL_HISTORY.history_id DESC";

            const sql = [sql1, sql2, sql3, sql4].join(" ");

            const sqlValue = [user_id];

            const queryResult = await pool.query(sql,sqlValue);

            const callHistory = queryResult[0];

            return callHistory;
        } catch (dbError) {
            console.log("Error When Getting Incoming Call History From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    /**
     * Retrieves the outgoing call history for a specific user from the CALL_HISTORY table.
     *
     * @param {number} user_id - The ID of the user for whom to retrieve outgoing call history.
     * @returns {Promise<Array>} - Returns an array of call history records for the specified user.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async getOutgoingCallHistory(user_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone, call_date, call_status, deepfake, CALL_HISTORY.created_at"
            const sql2 = "FROM CALL_HISTORY JOIN APP_USER ON CALL_HISTORY.receiver = APP_USER.user_id"
            const sql3 = "WHERE sender = ?";
            const sql4 = "ORDER BY CALL_HISTORY.history_id DESC";

            const sql = [sql1, sql2, sql3, sql4].join(" ");

            const sqlValue = [user_id];

            const queryResult = await pool.query(sql,sqlValue);

            const callHistory = queryResult[0];

            return callHistory;
        } catch (dbError) {
            console.log("Error When Getting Outgoing Call History From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }
}

module.exports = Call_History;