const User = require('../Class_Entity/User');
const Contact = require('../Class_Entity/Contact');
const Call_History = require('../Class_Entity/Call_History');
const ServiceTime = require('./ServiceTime');
const Block_Log = require('../Class_Entity/Block_Log');
const Report_Log = require('../Class_Entity/Report_Log');
const WebSocket = require('ws');

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
                throw {status: 401, message: 'Unauthorized'};
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
            if (error.status) {
                throw error;
            } else {
                throw {status: 500, message: 'Internal Server Error'};
            }
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

    async userDeclineCall(room_id, websockets) {
        try {
            const caller_section = room_id.split('R')[0];
            const caller_id = parseInt(caller_section.split('C')[1]);
            websockets.forEach((client) => {
                if (client.id === caller_id && client.readyState === WebSocket.OPEN) {
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