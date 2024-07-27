class Call_History {
    static async insertCallHistory(sender, receiver, call_date, call_status, deepfake) {
        const {pool} = require('../Database.js');
        let connection = null;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const sqlRegisterCallHistory = 'INSERT INTO CALL_HISTORY (sender, receiver, call_date, call_status, deepfake) VALUES(?, ?, ?, ?, ?)';
            const sqlRegisterCallHistoryValue = [sender, receiver, call_date, call_status, deepfake];
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

    static async getIncomingCallHistory(user_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone, call_date, call_status, deepfake"
            const sql2 = "FROM CALL_HISTORY JOIN APP_USER ON CALL_HISTORY.sender = APP_USER.user_id"
            const sql3 = "WHERE receiver = ?";
            const sql4 = "ORDER BY CALL_HISTORY.call_date DESC";

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

    static async getOutgoingCallHistory(user_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone, call_date, call_status, deepfake"
            const sql2 = "FROM CALL_HISTORY JOIN APP_USER ON CALL_HISTORY.receiver = APP_USER.user_id"
            const sql3 = "WHERE sender = ?";
            const sql4 = "ORDER BY CALL_HISTORY.call_date DESC";

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