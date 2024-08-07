class Block_Log {
   static async block(blocked_id, created_by) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'INSERT INTO BLOCK_LOG (blocked_id, created_by, modified_by) VALUES (?, ?, ?)';
            const sqlValue = [blocked_id, created_by, created_by];

            const updateResult = await pool.query(sql, sqlValue);

            if (updateResult[0].affectedRows === 0) {
                const error = new Error("Forbidden");
                error.status = 403;
                return Promise.reject(error);
            }
    
            return 200;
        } catch(dbError) {
            if (dbError.code !== undefined && dbError.code === 'ER_NO_REFERENCED_ROW_2') {
                const error = new Error("Cannot Block A Contact That Does Not Exist");
                error.status = 403;
                throw error; 
            } else if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("Contact Already Blocked");
                error.status = 409;
                throw error; 
            } else {
                console.log("Error When Blocking A User: " + dbError);
                const error = new Error("Internal Server Error");
                error.status = 500;
                throw error; 
            }
        }
    }

    static async unblock(blocked_id, created_by) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'DELETE FROM BLOCK_LOG WHERE blocked_id = ? AND created_by = ?';
            const sqlValue = [blocked_id, created_by];

            const updateResult = await pool.query(sql, sqlValue);

            if (updateResult[0].affectedRows === 0) {
                const error = new Error("Contact Is Not Blocked");
                error.status = 403;
                return Promise.reject(error);
            }

            return 200;
        } catch(dbError) {
            console.log("Error When Unblocking A User: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }
}

module.exports = Block_Log;