const User = require('../Class_Entity/User');
const Contact = require('../Class_Entity/Contact');
const Call_History = require('../Class_Entity/Call_History');
const ServiceTime = require('./ServiceTime');
const Block_Log = require('../Class_Entity/Block_Log');
const Report_Log = require('../Class_Entity/Report_Log');

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

    async userAddContact(contact_id) {
        try {
            await Contact.insertContact(this.user.userID, contact_id)
            return 200;
        } catch(error) {
            throw error;
        }
    }

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

    async userReport(contact_id) {
        try {
            await Report_Log.report(contact_id, this.user.userID);
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

    async getUserContacts(name) {
        try {
            const contacts = await Contact.getStorerContacts(this.user.userID, name);
            for (let i = 0; i < contacts.length; i++) {
                contacts[i].initial = this.getInitial(contacts[i].user_name);
            }
            return contacts;
        } catch (error) {
            throw error;
        }
    }

    async userSearchUser(name) {
        try {
            const users = await User.searchUser(name);
            return users;
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
                deepfakeCallPercentage = ((deepfakeCallQuantity / (incomingCallHistory.length + outgoingCallHistory.length)) * 100).toString() + '%';
            }

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