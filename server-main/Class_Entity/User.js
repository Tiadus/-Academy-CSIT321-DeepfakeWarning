class User {
    constructor(userInformation) {
        this.userID = userInformation.user_id;
        this.email = userInformation.email;
        this.user_name = userInformation.user_name;
        this.avatar = userInformation.avatar;
        this.phone = userInformation.phone;
    }

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

    async setProfile(email, user_name, avatar, phone, user_password) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'UPDATE APP_USER SET email = ?, user_name = ?, avatar = ?, phone = ?, user_password = ?, modified_by = ? WHERE user_id = ?';
            const sqlValue = [email, user_name, avatar, phone, user_password, this.userID, this.userID];

            const updateResult = await pool.query(sql, sqlValue);

            if (updateResult[0].affectedRows === 0) {
                const error = new Error("Forbidden");
                error.status = 403;
                return Promise.reject(error);
            }

            return 200;
        }
        catch(dbError) {
            console.log("Error When Updating User Profile: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }
}

module.exports = User;