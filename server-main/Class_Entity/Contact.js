class Contact {
    /**
     * Creates an instance of the Contact class.
     *
     * @param {Object} contactInformation - An object containing contact information.
     * @param {number} contactInformation.contact_id - The ID of the contact.
     * @param {number} contactInformation.storer_id - The ID of the user who stores the contact.
     * @param {number} contactInformation.stored_id - The ID of the user being stored as a contact.
     * @param {boolean} contactInformation.blocked - Indicates whether the contact is blocked.
     */
    constructor(contactInformation) {
        this.contact_id = contactInformation.contact_id;
        this.storer_id = contactInformation.storer_id;
        this.stored_id = contactInformation.stored_id;
        this.blocked = contactInformation.blocked;
    }

    /**
     * Inserts a new contact into the CONTACT table.
     *
     * @param {number} storer_id - The ID of the user storing the contact.
     * @param {number} stored_id - The ID of the user being stored as a contact.
     * @returns {Promise<number>} - Returns the ID of the inserted contact record.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 409 if the contact already exists (duplicate entry).
     *   - 500 for any internal server error during the database operation.
     */
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

    /**
     * Deletes a contact from the CONTACT table.
     *
     * @param {number} storer_id - The ID of the user who stored the contact.
     * @param {number} stored_id - The ID of the contact to be deleted.
     * @returns {Promise<number>} - Returns 200 if the deletion was successful.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 403 if the contact does not exist or the deletion is forbidden.
     *   - 500 for any internal server error during the database operation.
     */
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

    /**
     * Retrieves the contacts stored by a specific user from the CONTACT table.
     *
     * @param {number} storer_id - The ID of the user who stored the contacts.
     * @param {string} name - The name (or part of it) to search for among the stored contacts.
     * @returns {Promise<Array>} - Returns an array of contact records that match the search criteria.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
    static async getStorerContacts(storer_id, name) {
        const {pool} = require('../Database.js');
        try {
            const sql1 = "SELECT user_id, email, user_name, avatar, phone"
            const sql2 = "FROM CONTACT JOIN APP_USER ON CONTACT.stored_id = APP_USER.user_id"
            const sql3 = "WHERE storer_id = ? AND user_name LIKE ?";
            const sql4 = "ORDER BY APP_USER.user_name ASC";

            const sql = [sql1, sql2, sql3, sql4].join(" ");

            const sqlValue = [storer_id, `%${name}%`];

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

    /**
     * Retrieves the contacts where the user is stored as the receiving end from the CONTACT table.
     *
     * @param {number} stored_id - The ID of the user for whom to retrieve stored contacts.
     * @returns {Promise<Array>} - Returns an array of contact records where the user is the stored contact.
     * @throws {Error} - Throws an error with specific status codes:
     *   - 500 for any internal server error during the database operation.
     */
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