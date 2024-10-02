class Block_Log {
    /**
     * Blocks a user by inserting an entry into the BLOCK_LOG table.
     *
     * @param {number} blocked_id - The ID of the user to be blocked.
     * @param {number} created_by - The ID of the user initiating the block (who is blocking).
     * @returns {Promise<number>} - Returns 200 if the block was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 403 if the block is forbidden (either the contact does not exist or no rows were affected).
     *   - 409 if the contact is already blocked.
     *   - 500 for any other internal server error.
     */
    static async block(blocked_id, created_by) {
        // Import the database connection pool from the Database module
        const {pool} = require('../Database.js');
        try {
            // Define the SQL query for inserting a new block log entry into the BLOCK_LOG table
            const sql = 'INSERT INTO BLOCK_LOG (blocked_id, created_by, modified_by) VALUES (?, ?, ?)';
            // SQL values to be inserted (blocked_id, created_by, modified_by)
            const sqlValue = [blocked_id, created_by, created_by];

            // Execute the query using the database connection pool
            const updateResult = await pool.query(sql, sqlValue);

            // Check if any rows were affected by the query (meaning the block was successful)
            if (updateResult[0].affectedRows === 0) {
                // If no rows were affected, reject the promise with a 403 Forbidden error
                const error = new Error("Forbidden");
                error.status = 403;
                return Promise.reject(error);
            }
    
            // Return 200 (OK) if the block was successful
            return 200;
        } catch(dbError) {
            // Handle specific database errors based on their error code
            
            // If the blocked_id does not exist in the referenced table (foreign key constraint)
            if (dbError.code !== undefined && dbError.code === 'ER_NO_REFERENCED_ROW_2') {
                const error = new Error("Cannot Block A Contact That Does Not Exist");
                error.status = 403;
                throw error;
            // If there's a duplicate entry in the block log (attempting to block the same contact twice)
            } else if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("Contact Already Blocked");
                error.status = 409;
                throw error;
            // For any other database errors, log the error and throw a generic 500 Internal Server Error
            } else {
                console.log("Error When Blocking A User: " + dbError);
                const error = new Error("Internal Server Error");
                error.status = 500;
                throw error; 
            }
        }
    }

    /**
     * Unblocks a user by removing an entry from the BLOCK_LOG table.
     *
     * @param {number} blocked_id - The ID of the user to be unblocked.
     * @param {number} created_by - The ID of the user initiating the unblock (who is unblocking).
     * @returns {Promise<number>} - Returns 200 if the unblock was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 403 if the unblock is forbidden (the contact is not currently blocked).
     *   - 500 for any other internal server error.
     */
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