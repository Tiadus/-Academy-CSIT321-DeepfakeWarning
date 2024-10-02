class User {
    /**
     * Creates an instance of the User class.
     *
     * @param {Object} userInformation - An object containing user information.
     * @param {number} userInformation.user_id - The unique identifier for the user.
     * @param {string} userInformation.email - The user's email address.
     * @param {string} userInformation.user_name - The user's display name.
     * @param {string} userInformation.avatar - The URL of the user's avatar image.
     * @param {string} userInformation.phone - The user's phone number.
     */
    constructor(userInformation) {
        this.userID = userInformation.user_id;
        this.email = userInformation.email;
        this.user_name = userInformation.user_name;
        this.avatar = userInformation.avatar;
        this.phone = userInformation.phone;
    }

    /**
     * Inserts a new user into the APP_USER table.
     *
     * @param {string} email - The email address of the user.
     * @param {string} user_name - The display name of the user.
     * @param {string} avatar - The URL of the user's avatar image.
     * @param {string} phone - The phone number of the user.
     * @param {string} user_password - The password for the user account.
     * @returns {Promise<number>} - Returns the ID of the newly created user.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 409 if the user already exists (duplicate entry).
     *   - 500 for any other internal server error during the database operation.
     */
    static async insertUser(email, user_name, avatar, phone, user_password) {
        const {pool} = require('../Database.js');
        let connection = null;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const sqlRegisterUser = 'INSERT INTO APP_USER (email, user_name, avatar, phone, user_password, modified_by) VALUES(?, ?, ?, ?, ?, ?)';
            const sqlRegisterUserValue = [email, user_name, avatar, phone, user_password, 0];
            const userRegisterResult = await connection.query(sqlRegisterUser, sqlRegisterUserValue);
            
            connection.commit();
            connection = null;

            return userRegisterResult[0].insertId;
        } catch (dbError) {
            if (connection !== null) {
                connection.rollback();
            }
            if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("User Already Exist");
                error.status = 409;
                throw error; 
            } else {
                console.log("Error While Inserting Customer: " + dbError);
                const error = new Error("Internal Server Error");
                error.status = 500;
                throw error; 
            }
        } finally {
            if (connection !== null) {
                connection.release();
            }
        }
    }

    /**
     * Retrieves a user from the APP_USER table based on email and password.
     *
     * @param {string} inputEmail - The email address of the user.
     * @param {string} inputPassword - The password of the user.
     * @returns {Promise<Object>} - Returns an object containing user information, including user ID, email, user name, avatar, and phone number.
     * @throws {Error} - Throws an error with a specific status code for internal server errors.
     */
    static async getUser(inputEmail, inputPassword) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone"
            const sql2 = "FROM APP_USER"
            const sql3 = "WHERE email = ? AND user_password = ?";

            const sql = [sql1, sql2, sql3].join(" ");

            const sqlValue = [inputEmail, inputPassword];

            const queryResult = await pool.query(sql,sqlValue);

            const users = queryResult[0];

            return users;
        } catch (dbError) {
            console.log("Error When Getting User From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    /**
     * Searches for users in the APP_USER table by user name.
     *
     * @param {string} name - The name or part of the name to search for.
     * @returns {Promise<Array<Object>>} - Returns an array of user objects that match the search criteria, each containing user ID, email, user name, avatar, and phone number.
     * @throws {Error} - Throws an error with a specific status code for internal server errors.
     */
    static async searchUser(name) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone"
            const sql2 = "FROM APP_USER"
            const sql3 = "WHERE user_name LIKE ?";

            const sql = [sql1, sql2, sql3].join(" ");

            const sqlValue = [`%${name}%`];

            const queryResult = await pool.query(sql,sqlValue);

            const users = queryResult[0];

            return users;
        } catch (dbError) {
            console.log("Error When Getting User From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    /**
     * Updates the user's profile information in the APP_USER table.
     *
     * @param {string} email - The new email address of the user.
     * @param {string} user_name - The new user name of the user.
     * @param {string} avatar - The new avatar URL of the user.
     * @param {string} phone - The new phone number of the user.
     * @returns {Promise<number>} - Returns 200 if the profile update was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 409 if the email address already exists (duplicate entry).
     *   - 500 for any other internal server error.
     */
    async setProfile(email, user_name, avatar, phone) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'UPDATE APP_USER SET email = ?, user_name = ?, avatar = ?, phone = ?, modified_by = ? WHERE user_id = ?';
            const sqlValue = [email, user_name, avatar, phone, this.userID, this.userID];

            const updateResult = await pool.query(sql, sqlValue);

            return 200;
        }
        catch(dbError) {
            if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("Email Already Exist");
                error.status = 409;
                throw error; 
            } else {
                console.log("Error When Updating User Profile: " + dbError);
                const error = new Error("Internal Server Error");
                error.status = 500;
                throw error;
            }
        }
    }

    /**
     * Updates the user's password in the APP_USER table.
     *
     * @param {string} newPassword - The new password for the user.
     * @returns {Promise<number>} - Returns 200 if the password update was successful.
     * @throws {Error} - Throws an error for any internal server error.
     */
    async setPassword(newPassword) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'UPDATE APP_USER SET user_password = ?, modified_by = ? WHERE user_id = ?';
            const sqlValue = [newPassword, this.userID, this.userID];

            const updateResult = await pool.query(sql, sqlValue);

            return 200;
        }
        catch(dbError) {
            console.log("Error When Updating User Profile: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }

    /**
     * Retrieves the count of reports for a specific user from the REPORT_LOG table.
     *
     * @param {number} target_id - The ID of the user for whom to count reports.
     * @returns {Promise<number>} - Returns the count of reports for the specified user.
     * @throws {Error} - Throws an error for any internal server error.
     */
    static async getReportCount(target_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'SELECT COUNT(*) FROM REPORT_LOG WHERE reported_id = ?'
            const sqlValue = [target_id];

            const queryResult = await pool.query(sql,sqlValue);

            const reportCount = queryResult[0][0]['COUNT(*)'];
            return reportCount;
        } catch (dbError) {
            console.log("Error When Getting Report Count: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }

    /**
     * Retrieves the block status between the current user and a specified user.
     *
     * @param {number} receiver_id - The ID of the user whose block status is being checked.
     * @returns {Promise<number>} - Returns the count of blocks (0 or 1) indicating whether the specified user is blocked.
     * @throws {Error} - Throws an error for any internal server error.
     */
    async getBlockStatus(receiver_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'SELECT COUNT(*) FROM BLOCK_LOG WHERE blocked_id = ? AND created_by = ?'
            const sqlValue = [this.userID, receiver_id];

            const queryResult = await pool.query(sql,sqlValue);

            const blockCount = queryResult[0][0]['COUNT(*)'];
            return blockCount;
        } catch (dbError) {
            console.log("Error When Getting Block Count: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }
}

module.exports = User;