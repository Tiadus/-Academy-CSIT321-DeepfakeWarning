class Report_Log {
    static async report(reported_id, created_by) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'INSERT INTO REPORT_LOG (reported_id, created_by, modified_by) VALUES (?, ?, ?)';
            const sqlValue = [reported_id, created_by, created_by];

            const updateResult = await pool.query(sql, sqlValue);
 
            if (updateResult[0].affectedRows === 0) {
                const error = new Error("Forbidden");
                error.status = 403;
                return Promise.reject(error);
            }

            return 200;
        } catch(dbError) {
            if (dbError.code !== undefined && dbError.code === 'ER_NO_REFERENCED_ROW_2') {
                const error = new Error("Cannot Report A User That Does Not Exist");
                error.status = 403;
                throw error; 
            } else if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("User Already Reported");
                error.status = 409;
                throw error; 
            } else {
                console.log("Error When Reporting User: " + dbError);
                const error = new Error("Internal Server Error");
                error.status = 500;
                throw error; 
            }
        }
    }
}
 
module.exports = Report_Log;