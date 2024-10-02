class Education {
    /**
     * Retrieves the list of educational titles from the EDUCATION table.
     *
     * @returns {Promise<Array>} - Returns an array of objects containing education_id and title.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
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

    /**
     * Retrieves the content for a specific educational record from the EDUCATION table.
     *
     * @param {number} education_id - The ID of the education record to retrieve.
     * @returns {Promise<Object>} - Returns the educational record corresponding to the specified ID.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
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