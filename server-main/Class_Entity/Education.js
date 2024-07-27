class Education {
    static async getTitle() {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT education_id, title"
            const sql2 = "FROM EDUCATION"

            const sql = [sql1, sql2].join(" ");

            const sqlValue = [];

            const queryResult = await pool.query(sql,sqlValue);

            const titles = queryResult[0];

            return titles;
        } catch (dbError) {
            console.log("Error When Getting Educational Title From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    static async getContent(education_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = "SELECT * FROM EDUCATION WHERE education_id = ?";

            const sqlValue = [education_id];

            const queryResult = await pool.query(sql,sqlValue);

            const contents = queryResult[0];

            return contents;
        } catch (dbError) {
            console.log("Error When Getting Educational Content From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }
}

module.exports = Education;