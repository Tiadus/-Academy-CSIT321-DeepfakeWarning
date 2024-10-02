const User = require('../Class_Entity/User');
const Contact = require('../Class_Entity/Contact');
const Call_History = require('../Class_Entity/Call_History');
const ServiceTime = require('./ServiceTime');
const Block_Log = require('../Class_Entity/Block_Log');
const Report_Log = require('../Class_Entity/Report_Log');
const WebSocket = require('ws');

class User_Controller {
    /**
     * Constructs an instance of the class.
     * Initializes the user property to null.
     */
    constructor() {
        this.user = null;
    }

    /**
     * Registers a new user by inserting their information into the database.
     * 
     * @param {string} email - The email address of the user.
     * @param {string} user_name - The name of the user.
     * @param {string} avatar - The URL of the user's avatar image.
     * @param {string} phone - The phone number of the user.
     * @param {string} user_password - The password for the user's account.
     * 
     * @returns {Promise<number>} The ID of the newly registered user.
     * 
     * @throws {Error} Throws an error if the user cannot be registered, 
     *                 including cases where the email already exists.
     */
    async registerUser(email, user_name, avatar, phone, user_password) {
        try {
            const newUserID = await User.insertUser(email, user_name, avatar, phone, user_password);
            return newUserID;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Authenticates a user by checking their email and password against the database.
     * 
     * @param {string} inputEmail - The email address of the user attempting to log in.
     * @param {string} inputPassword - The password of the user attempting to log in.
     * 
     * @returns {Promise<void>} 
     * 
     * @throws {Object} Throws an error object with status code and message if authentication fails,
     *                 specifically if the user is not found or if credentials are incorrect.
     */
    async authenticateUser(inputEmail, inputPassword) {
        try {
            const users = await User.getUser(inputEmail, inputPassword);

            if (users.length === 0) {
                throw {status: 401, message: 'Unauthorized'};
            }

            const authorizedUser = users[0];

            this.user = new User(authorizedUser);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Edits the user profile or updates the user's password based on the provided mode.
     * 
     * @param {string} mode - The mode of the edit operation: "profile" for profile updates, "password" for password changes.
     * @param {string} email - The new email address of the user (required in "profile" mode).
     * @param {string} user_name - The new username of the user (required in "profile" mode).
     * @param {string} avatar - The new avatar URL of the user (required in "profile" mode).
     * @param {string} phone - The new phone number of the user (required in "profile" mode).
     * @param {string} oldPassword - The user's current password (required for both modes).
     * @param {string} newPassword - The new password for the user (required in "password" mode).
     * 
     * @returns {Promise<Object>} Returns a user object containing user ID, email, username, avatar, phone, and authentication details.
     * 
     * @throws {Object} Throws an error object with a status code and message if the input is invalid or if the update operation fails,
     *                 specifically if any required fields are missing or if an internal error occurs.
     */
    async userEditProfile(mode, email, user_name, avatar, phone, oldPassword, newPassword) {
        try {
            if (mode === "profile") {
                if (email === undefined || user_name === undefined || avatar === undefined || phone === undefined) {
                    const badRequestError = new Error('Bad Request');
                    badRequestError.status = 400;
                    throw badRequestError;
                }
                await this.user.setProfile(email, user_name, avatar, phone);
                const encodedAuthentication = btoa(email + ':' + oldPassword);
                const auth = `Basic ${encodedAuthentication}`;
                const newUser = {
                    user_id: this.user.userID,
                    email: email,
                    user_name: user_name,
                    avatar: avatar,
                    phone: phone,
                    auth: auth
                }
                return newUser;
            } else if (mode === "password") {
                if (newPassword === undefined) {
                    const badRequestError = new Error('Bad Request');
                    badRequestError.status = 400;
                    throw badRequestError;
                }
                await this.user.setPassword(newPassword);
                const encodedAuthentication = btoa(this.user.email + ':' + newPassword);
                const auth = `Basic ${encodedAuthentication}`;
                const newUser = {
                    user_id: this.user.userID,
                    email: this.user.email,
                    user_name: this.user.user_name,
                    avatar: this.user.avatar,
                    phone: this.user.phone,
                    auth: auth
                }
                return newUser;
            } else {
                const badRequestError = new Error('Bad Request');
                badRequestError.status = 400;
                throw badRequestError;
            }
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                console.log(error);
                const internalServerError = new Error('Internal Server Error');
                internalServerError.status = 500;
                throw internalServerError;
            }
        }
    }

    /**
     * Adds a contact for the current user.
     * 
     * @param {number} contact_id - The ID of the contact to be added.
     * 
     * @returns {Promise<number>} Returns a status code of 200 if the contact is successfully added.
     * 
     * @throws {Error} Throws an error if the contact addition fails, typically due to a database issue or if the contact already exists.
     */
    async userAddContact(contact_id) {
        try {
            await Contact.insertContact(this.user.userID, contact_id)
            return 200;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Sets the block status for a specified contact.
     * 
     * @param {number} blockStatus - The desired block status for the contact.
     *                              - 0 to unblock the contact.
     *                              - 1 to block the contact.
     * 
     * @param {number} contact_id - The ID of the contact to be blocked or unblocked.
     * 
     * @returns {Promise<number>} Returns a status code of 200 if the operation is successful.
     * 
     * @throws {Error} Throws an error if the block status is invalid (not 0 or 1) or if the blocking/unblocking fails.
     */
    async userSetBlockStatus(blockStatus, contact_id) {
        try {
            if (blockStatus === 0) {
                await Block_Log.unblock(contact_id, this.user.userID);
                return 200;
            } else if (blockStatus === 1) {
                await Block_Log.block(contact_id, this.user.userID);
                return 200;
            } else {
                const badRequestError = new Error('Bad Request');
                badRequestError.status = 400;
                throw badRequestError;
            }
        } catch(error) {
            throw error;
        }
    }

    /**
     * Reports a specified contact.
     * 
     * @param {number} contact_id - The ID of the contact to be reported.
     * 
     * @returns {Promise<number>} Returns a status code of 200 if the report operation is successful.
     * 
     * @throws {Error} Throws an error if the reporting fails due to various reasons (e.g., user does not exist, user already reported).
     */
    async userReport(contact_id) {
        try {
            await Report_Log.report(contact_id, this.user.userID);
            return 200;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Deletes a specified contact from the user's contact list.
     * 
     * @param {number} contact_id - The ID of the contact to be deleted.
     * 
     * @returns {Promise<number>} Returns a status code of 200 if the contact deletion is successful.
     * 
     * @throws {Error} Throws an error if the deletion fails, such as when the contact does not exist or the user is not authorized to delete the contact.
     */
    async userDeleteContact(contact_id) {
        try {
            await Contact.deleteContact(this.user.userID, contact_id);
            return 200;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Retrieves the initials from a given name. If the name consists of a single word,
     * it returns the first letter as the initial. If the name consists of multiple words,
     * it returns the first letter of the first and the last word.
     *
     * @param {string} name - The full name from which to extract initials.
     * 
     * @returns {string} Returns the initials in uppercase. If no initials can be determined,
     *                  an empty string is returned.
     *
     * @example
     * getInitial("John Doe"); // Returns "JD"
     * getInitial("Alice");    // Returns "A"
     * getInitial("");         // Returns ""
     */
    getInitial = (name) => {
        const splitName = name.split(' ');
        let initial = ''

        if (splitName.length === 1) {
            initial = splitName[0][0];
            return initial.toUpperCase();
        }

        if (splitName.length > 1) {
            initial = splitName[0][0] + splitName[splitName.length-1][0];
            return (initial.toUpperCase());
        }

        return initial;
    }

    /**
     * Retrieves the contacts for the authenticated user, filtered by a given name.
     * For each contact, it also generates an initial based on the contact's user name.
     *
     * @param {string} name - The name to filter contacts by. This name can be a full name or a part of it.
     * 
     * @returns {Array<Object>} Returns an array of contact objects, each augmented with an 'initial' property 
     *                          representing the initials derived from the user's name.
     *                          Each contact object contains properties such as user_id, email, user_name, 
     *                          avatar, phone, and initial.
     * 
     * @throws {Object} Throws an error with a status code and message if an internal error occurs.
     *                  If a specific error status exists, it will rethrow that error.
     */
    async getUserContacts(name) {
        try {
            const contacts = await Contact.getStorerContacts(this.user.userID, name);
            for (let i = 0; i < contacts.length; i++) {
                contacts[i].initial = this.getInitial(contacts[i].user_name);
            }
            return contacts;
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Searches for users based on a given name.
     *
     * This function queries the user database for users whose names match the provided 
     * search term. It returns an array of user objects that meet the search criteria.
     *
     * @param {string} name - The name to search for. This may be a full name or a partial name.
     *
     * @returns {Array<Object>} Returns an array of user objects that match the search criteria.
     *                          Each user object typically includes properties such as user_id, 
     *                          email, user_name, avatar, and phone.
     *
     * @throws {Object} Throws an error if there is an issue during the search process.
     *                  The error will propagate with its original status and message.
     */
    async userSearchUser(name) {
        try {
            const users = await User.searchUser(name);
            return users;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if a specified receiver is blocked by the current user.
     *
     * This function retrieves the user's stored contacts and checks if the specified
     * receiver is present in the list and marked as blocked. 
     *
     * @param {number} receiver_id - The ID of the receiver whose blocked status needs to be checked.
     *
     * @returns {boolean} Returns `true` if the receiver is blocked by the user, 
     *                   otherwise returns `false`.
     *
     * @throws {Object} Throws an error if there is an issue retrieving the contacts.
     *                  The error will propagate with its original status and message.
     */
    async checkReceiverBlockedStatus(receiver_id) {
        try {
            const contacts = await Contact.getStoredContacts(this.user.userID);
            let isBlocked = false;

            for (let i = 0; i < contacts.length; i++) {
                if (contacts[i].storer_id === receiver_id && contacts[i].blocked == true) {
                    isBlocked = true;
                }
            }

            return isBlocked;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves statistics for the current user's call history.
     *
     * This function gathers the incoming and outgoing call history for the user,
     * processes the data to convert call dates, and counts the number of calls
     * identified as deepfake. It calculates the percentage of deepfake calls
     * in relation to the total number of calls.
     *
     * @returns {Object} An object containing:
     *                   - {Array} incomingCallHistory: The processed array of incoming call records.
     *                   - {Array} outgoingCallHistory: The processed array of outgoing call records.
     *                   - {string} deepfakeCallPercentage: The percentage of deepfake calls as a string.
     *
     * @throws {Object} Throws an error if there is an issue retrieving call history.
     *                  The error will propagate with its original status and message.
     */
    async getUserStatistic() {
        try {
            const serviceTime = new ServiceTime();

            let deepfakeCallQuantity = 0;
            const incomingCallHistory = await Call_History.getIncomingCallHistory(this.user.userID);
            const outgoingCallHistory = await Call_History.getOutgoingCallHistory(this.user.userID);

            for (let i = 0; i < incomingCallHistory.length; i++) {
                incomingCallHistory[i].call_date = serviceTime.convertDate(incomingCallHistory[i].call_date);
                incomingCallHistory[i].initial = this.getInitial(incomingCallHistory[i].user_name);
                if (incomingCallHistory[i].deepfake == true) {
                    deepfakeCallQuantity += 1;
                }
            }

            for (let i = 0; i < outgoingCallHistory.length; i++) {
                outgoingCallHistory[i].call_date = serviceTime.convertDate(outgoingCallHistory[i].call_date);
                outgoingCallHistory[i].initial = this.getInitial(outgoingCallHistory[i].user_name);
                if (outgoingCallHistory[i].deepfake == true) {
                    deepfakeCallQuantity += 1;
                }
            }

            let deepfakeCallPercentage = '0%';

            if (incomingCallHistory.length + outgoingCallHistory.length !== 0) {
                deepfakeCallPercentage = parseInt(((deepfakeCallQuantity / (incomingCallHistory.length + outgoingCallHistory.length)) * 100)).toString() + '%';
            }

            return {
                incomingCallHistory: incomingCallHistory,
                outgoingCallHistory: outgoingCallHistory,
                deepfakeCallPercentage: deepfakeCallPercentage
            };
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                console.log(error);
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Checks if a user is banned based on the number of reports against them.
     *
     * This function retrieves the report count for a specified user ID and
     * determines if the user should be considered banned. A user is banned
     * if they have received 100 or more reports.
     *
     * @param {number} user_id - The ID of the user to check for ban status.
     * @returns {boolean} Returns `true` if the user is banned, `false` otherwise.
     *
     * @throws {Object} Throws an error if there is an issue retrieving the report count.
     *                  The error will propagate with its original status and message.
     */
    async isUserBanned(user_id) {
        try {
            const reportCount = await User.getReportCount(user_id);

            if (reportCount >= 100) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Checks if a user is blocked by the current user.
     *
     * This function retrieves the block status for a specified receiver ID.
     * It determines if the receiver is blocked by checking if the count of 
     * block records is greater than zero.
     *
     * @param {number} receiver_id - The ID of the user to check the block status against.
     * @returns {boolean} Returns `true` if the user is blocked, `false` otherwise.
     *
     * @throws {Object} Throws an error if there is an issue retrieving the block status.
     *                  The error will propagate with its original status and message.
     */
    async isUserBlocked(receiver_id) {
        try {
            const blockCount = await this.user.getBlockStatus(receiver_id);

            if (blockCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    } 

    /**
     * Initiates a call to a specified receiver.
     *
     * This function checks if the user is banned from communication and if the
     * receiver is blocked before creating a call history entry. If the receiver is online,
     * it sends an incoming call notification to them via WebSocket.
     *
     * @param {number} receiver_id - The ID of the user to call.
     * @param {Array} websockets - An array of WebSocket clients to check for the receiver's availability.
     * @returns {string} Returns the room ID for the call.
     *
     * @throws {Object} Throws an error if:
     *                  - The user is banned (403 status).
     *                  - The user is blocked by the receiver (403 status).
     *                  - The receiver is unavailable (404 status).
     *                  - There is an internal server error (500 status).
     */
    async userInitiateCall(receiver_id, websockets) {
        try {
            //Check if the user is banned
            const isUserBanned = await this.isUserBanned(this.user.userID);
            if (isUserBanned === true) {throw {status: 403, message: 'You Are Currently Being Banned From Communication Feature'}};

            //Check if the user is blocked
            const isUserBlocked = await this.isUserBlocked(receiver_id);
            if (isUserBlocked === true) {throw {status: 403, message: 'You Are Being Blocked By The Receiver'}};

            //Create the call history
            const serviceTime = new ServiceTime();
            const serverTime = serviceTime.getServerTime();
            const call_date = `${serverTime.year}-${serverTime.month}-${serverTime.day}`;
            const call_status = '0' // [0-Missed] [1-Declined] [2-Connected]
            const deepfake = false;
            const time = `${serverTime.year}${serverTime.month}${serverTime.day}${serverTime.hour}${serverTime.minute}${serverTime.second}`;
            const room_id = `C${this.user.userID}R${receiver_id}T${time}`;
            await Call_History.insertCallHistory(this.user.userID, receiver_id, call_date, call_status, deepfake, room_id);

            //Check if the receiver is online
            let clientFound = false;
            websockets.forEach((client) => {
                if (client.id === receiver_id && client.readyState === WebSocket.OPEN) {
                    clientFound = true;
                    const message = {
                        mode: 'incoming',
                        room_id: room_id,
                        avatar: `user${this.user.userID}.jpg`,
                        user_name: this.user.user_name
                    }
                    client.send(JSON.stringify(message));
                }
            });

            if (clientFound === false) {
                throw {status: 404, message: 'Receiver Unavailable'}
            }

            websockets.forEach((client) => {
                if (client.id === this.user.userID && client.readyState === WebSocket.OPEN) {
                    client.room = room_id;
                    client.deepfake = false;
                }
            });

            return room_id;
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                console.log(error);
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Declines a call from a specified caller.
     *
     * This function sends a decline message to the caller and updates the call history
     * to reflect that the call was declined.
     *
     * @param {string} room_id - The ID of the call room being declined.
     * @param {Array} websockets - An array of WebSocket clients to notify the caller.
     *
     * @throws {Object} Throws an error if:
     *                  - There is an internal server error (500 status).
     */
    async userDeclineCall(room_id, websockets) {
        try {
            const caller_section = room_id.split('R')[0];
            const caller_id = parseInt(caller_section.split('C')[1]);
            websockets.forEach((client) => {
                if (client.id === caller_id || client.id === caller_id * -1 && client.readyState === WebSocket.OPEN) {
                    const messageObj = {
                        mode: 'decline',
                    }  
                    client.send(JSON.stringify(messageObj));
                }
            });
            await Call_History.updateCallHistory('1', this.user.userID, room_id);
            return;
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Accepts an incoming call from a specified caller.
     *
     * This function updates the call history to reflect that the call has been accepted
     * and assigns the call room to the current user's WebSocket client.
     *
     * @param {string} room_id - The ID of the call room being accepted.
     * @param {Array} websockets - An array of WebSocket clients to update the caller.
     *
     * @throws {Object} Throws an error if:
     *                  - There is an internal server error (500 status).
     */
    async userAcceptCall(room_id, websockets) {
        try {
            await Call_History.updateCallHistory('2', this.user.userID, room_id);

            websockets.forEach((client) => {
                if (client.id === this.user_id && client.readyState === WebSocket.OPEN) {
                    client.room = room_id;
                    client.deepfake = false;
                }
            });

            return;
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Handles the reception of an incoming call by accepting or declining it based on the receiver's action.
     *
     * This function processes the receiver's action (either accepting or declining the call)
     * and calls the corresponding function to update the call history and notify the caller.
     *
     * @param {string} room_id - The ID of the call room associated with the incoming call.
     * @param {string} receiver_action - The action taken by the receiver ('accept' or 'decline').
     * @param {Array} websockets - An array of WebSocket clients to notify the caller of the receiver's action.
     *
     * @throws {Object} Throws an error if:
     *                  - The receiver action is invalid (403 status).
     *                  - There is an internal server error (500 status).
     */
    async userReceiveCall(room_id, receiver_action, websockets) {
        try {
            switch (receiver_action) {
                case 'accept':
                    await this.userAcceptCall(room_id, websockets);
                    break;
                case 'decline':
                    await this.userDeclineCall(room_id, websockets);
                    break;
                default:
                    throw {status: 403, message: 'Bad Request'};
            }
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }

    /**
     * Handles communication actions for calls based on the provided request body.
     *
     * This function processes different modes of communication:
     * - Initiating a call with a specific receiver.
     * - Receiving a call with an action (accept or decline).
     *
     * @param {Object} body - The request body containing the communication details.
     * @param {string} body.mode - The mode of communication ('initiate' or 'receive').
     * @param {number} [body.receiver_id] - The ID of the receiver for initiating a call (required for 'initiate' mode).
     * @param {string} [body.room_id] - The ID of the call room (required for 'receive' mode).
     * @param {string} [body.receiver_action] - The action taken by the receiver ('accept' or 'decline') for 'receive' mode.
     * @param {Array} websockets - An array of WebSocket clients to notify about the call status.
     *
     * @throws {Object} Throws an error if:
     *                  - The mode is undefined (403 status).
     *                  - Required parameters for initiating or receiving calls are missing or invalid (403 status).
     *                  - There is an internal server error (500 status).
     *
     * @returns {Promise<string>} Returns the room ID for initiated calls or 'main' for received call actions.
     */
    async handleCommunication(body, websockets) {
        try {
            const mode = body.mode;
            const receiver_id = body.receiver_id;
            const room_id = body.room_id;
            const receiver_action = body.receiver_action;

            if (mode === undefined) {
                throw {status: 403, message: 'Bad Request'};
            }

            if (mode === 'initiate') {
                if (receiver_id === undefined || isNaN(receiver_id) === true) {
                    throw {status: 403, message: 'Bad Request'};
                }
                const room_id = await this.userInitiateCall(parseInt(receiver_id), websockets);
                return room_id;
            } else if (mode === 'receive') {
                if (room_id === undefined || receiver_action === undefined) {
                    throw {status: 403, message: 'Bad Request'};
                }
                await this.userReceiveCall(room_id, receiver_action, websockets);
                return 'main';
            } else {
                throw {status: 403, message: 'Bad Request'};
            }
        } catch (error) {
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
        }
    }
}

module.exports = User_Controller;