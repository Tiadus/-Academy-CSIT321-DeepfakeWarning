class Contact {
    constructor(contactInformation) {
        this.contact_id = contactInformation.contact_id;
        this.storer_id = contactInformation.storer_id;
        this.stored_id = contactInformation.stored_id;
        this.blocked = contactInformation.blocked;
    }

    static async insertContact(storer_id, stored_id) {
        const {pool} = require('../Database.js');
        let connection = null;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const sqlRegisterContact = 'INSERT INTO CONTACT (storer_id, stored_id) VALUES(?, ?)';
            const sqlRegisterContactValue = [storer_id, stored_id];
            const contactRegisterResult = await connection.query(sqlRegisterContact, sqlRegisterContactValue);
            
            connection.commit();
            connection = null;

            return contactRegisterResult[0].insertId;
        } catch (dbError) {
            if (connection !== null) {
                connection.rollback();
            }

            if (dbError.code !== undefined && dbError.code === 'ER_DUP_ENTRY') {
                const error = new Error("Contact Already Exist");
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

    static async deleteContact(storer_id, stored_id) {
        const {pool} = require('../Database.js');
        try {
            const sql = 'DELETE FROM CONTACT WHERE storer_id = ? AND stored_id = ?';
            const sqlValue = [storer_id, stored_id];

            const deleteResult = await pool.query(sql, sqlValue);

            if (deleteResult[0].affectedRows === 0) {
                const error = new Error("Forbidden");
                error.status = 403;
                return Promise.reject(error);
            }

            return 200;
        }
        catch(dbError) {
            console.log("Error When Deleting Contact: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error;
        }
    }

    static async getStorerContacts(storer_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone"
            const sql2 = "FROM CONTACT JOIN APP_USER ON CONTACT.stored_id = APP_USER.user_id"
            const sql3 = "WHERE storer_id = ?";
            const sql4 = "ORDER BY APP_USER.user_name ASC";

            const sql = [sql1, sql2, sql3, sql4].join(" ");

            const sqlValue = [storer_id];

            const queryResult = await pool.query(sql,sqlValue);

            const contacts = queryResult[0];

            return contacts;
        } catch (dbError) {
            console.log("Error When Getting Contact From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }

    //Get the contacts that the user is stored as the receiving end
    static async getStoredContacts(stored_id) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT *"
            const sql2 = "FROM CONTACT"
            const sql3 = "WHERE stored_id = ?";

            const sql = [sql1, sql2, sql3].join(" ");

            const sqlValue = [stored_id];

            const queryResult = await pool.query(sql,sqlValue);

            const contacts = queryResult[0];

            return contacts;
        } catch (dbError) {
            console.log("Error When Getting Contact From Database: " + dbError);
            const error = new Error("Internal Server Error");
            error.status = 500;
            throw error; 
        }
    }
}

module.exports = Contact;