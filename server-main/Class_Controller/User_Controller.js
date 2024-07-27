const User = require('../Class_Entity/User');
const Contact = require('../Class_Entity/Contact');
const Call_History = require('../Class_Entity/Call_History');
const ServiceTime = require('./ServiceTime');

class User_Controller {
    constructor() {
        this.user = null;
    }

    async registerUser(email, user_name, avatar, phone, user_password) {
        try {
            const newUserID = await User.insertUser(email, user_name, avatar, phone, user_password);
            return newUserID;
        } catch (error) {
            throw error;
        }
    }

    async authenticateUser(inputEmail, inputPassword) {
        try {
            const users = await User.getUser(inputEmail, inputPassword);

            if (users.length === 0) {
                const error = new Error("Unauthorized");
                error.status = 401;
                return Promise.reject(error);
            }

            const authorizedUser = users[0];

            this.user = new User(authorizedUser);
            return;
        } catch (error) {
            throw error;
        }
    }

    async userEditProfile(email, user_name, avatar, phone, user_password) {
        try {
            await this.user.setProfile(email, user_name, avatar, phone, user_password);
            return 200;
        } catch (error) {
            throw error;
        }
    }

    async userAddContact(contact_id) {
        try {
            await Contact.insertContact(this.user.userID, contact_id)
            return 200;
        } catch(error) {
            throw error;
        }
    }

    async userSetBlockStatus(blocked, stored_id) {
        try {
            await Contact.setBlockStatus(blocked, this.user.userID, stored_id);
            return 200;
        } catch(error) {
            throw error;
        }
    }

    async userDeleteContact(contact_id) {
        try {
            await Contact.deleteContact(this.user.userID, contact_id);
            return 200;
        } catch(error) {
            throw error;
        }
    }

    async getUserContacts() {
        try {
            const contacts = await Contact.getStorerContacts(this.user.userID);
            return contacts;
        } catch (error) {
            throw error;
        }
    }

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

    async getUserStatistic() {
        try {
            const serviceTime = new ServiceTime();

            let deepfakeCallQuantity = 0;
            const incomingCallHistory = await Call_History.getIncomingCallHistory(this.user.userID);
            const outgoingCallHistory = await Call_History.getOutgoingCallHistory(this.user.userID);

            for (let i = 0; i < incomingCallHistory.length; i++) {
                incomingCallHistory[i].call_date = serviceTime.convertDate(incomingCallHistory[i].call_date);
                if (incomingCallHistory[i].deepfake === true) {
                    deepfakeCallQuantity += 1;
                }
            }

            for (let i = 0; i < outgoingCallHistory.length; i++) {
                outgoingCallHistory[i].call_date = serviceTime.convertDate(outgoingCallHistory[i].call_date);
                if (outgoingCallHistory[i].deepfake === true) {
                    deepfakeCallQuantity += 1;
                }
            }

            const deepfakeCallPercentage = ((deepfakeCallQuantity / (incomingCallHistory.length + outgoingCallHistory.length)) * 100).toString() + '%';

            return {
                incomingCallHistory: incomingCallHistory,
                outgoingCallHistory: outgoingCallHistory,
                deepfakeCallPercentage: deepfakeCallPercentage
            };
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = User_Controller;