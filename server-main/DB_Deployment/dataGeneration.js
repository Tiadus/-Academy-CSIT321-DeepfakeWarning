const fs = require('fs').promises;
const path = require('path');

/**
 * Generates a random integer between the specified minimum and maximum values, inclusive.
 * 
 * @param {number} min - The minimum integer value (inclusive).
 * @param {number} max - The maximum integer value (inclusive).
 * @returns {number} A random integer between min and max, inclusive.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a list of users
 * * @returns {Array<Object>} An array of users.
 */
function generateUsers() {
    let userList = [];

    const NAME = [
        'Rem',
        'Nino Nakano',
        'Eris Greyrat',
        'Brian Badluck',
        'Harold Pain',
        'Pepe Meme',
        'Doge Shinu',
        'Shrek Orge',
        'Mike Kowalski',
        'Noko Shikanoko',
        'Motivated Man',
        'Hacker Man',
        'The Scientist',
        'Frieren',
        'Thai Nguyen',
    ]

    for (let i = 0; i < 15; i++) {
        const email = "user" + (i + 1).toString() + "@mail.com"
        const user_name = NAME[i].toString();
        const avatar = "user" + (i + 1).toString() + ".jpg"
        const phone = "091234567891";
        const password = "password" + (i+1).toString();

        const aUser = {
            email: email,
            user_name: user_name,
            avatar: avatar,
            phone: phone,
            password: password
        }

        userList.push(aUser);
    }

    return userList;
}

/**
 * Generates a list of contacts for user with id 15
 * * @returns {Array<Object>} An array of contact objects, each having 'storer' and 'stored' properties.
 */
function generateContacts() {
    let contactList = [];

    for (let i = 0; i < 14; i++) {
        const storer = 15;
        const stored = i+1;

        const aContact = {
            storer: storer,
            stored: stored
        }

        contactList.push(aContact);
    }

    return contactList;
}

/**
 * Retrieves the current server date and time in a formatted array.
 * 
 * The function returns an array containing the current year, month, day, hour, 
 * minute, and second, all as strings formatted to two digits where applicable.
 * 
 * @returns {Array<string>} An array with six elements: [year, month, day, hour, minute, second].
 */
function getServerCallTime() {
    // Get the current date and time
    const currentDate = new Date();

    // Extract date and time components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');

    return [year, month, day, hour, minute, second];
}

/**
 * Generates a call history record for users in a system.
 *
 * This function creates a list of call history objects representing calls made 
 * between a set sender and receivers, including details such as call date, 
 * call status, and whether deepfake technology was used.
 * 
 * @returns {Array<Object>} An array of call history objects, each containing 
 * the sender, receiver, call date, call status, deepfake status, and room ID.
 */
function generateCallHistory() {
    const historyList = [];

    const timeInfo = getServerCallTime();
    const year = timeInfo[0];
    const month = timeInfo[1];
    const date = timeInfo[2];
    const hour = timeInfo[3];
    const minute = timeInfo[4];
    const second = parseInt(timeInfo[5]);

    const callDate = `${year}-${month}-${date}`;

    for (let i = 1; i <=5; i++) {
        const sender = 15;
        const receiver = i;
        const status = getRandomInt(0,2);
        const deepfake = getRandomInt(0,1);
        const time = getServerCallTime();
        const room_id = `C${sender}R${receiver}T${time[0]}${time[1]}${time[2]}${time[3]}${time[4]}${time[5]}`;

        const aHistory = {
            sender: sender,
            receiver: receiver,
            callDate: callDate,
            status: status,
            deepfake: deepfake,
            room_id: room_id
        }

        historyList.push(aHistory);
    }

    for (let i = 6; i <= 10; i++) {
        const sender = i;
        const receiver = 15;
        const status = getRandomInt(0,2);
        const deepfake = getRandomInt(0,1);
        const time = getServerCallTime();
        const room_id = `C${sender}R${receiver}T${time[0]}${time[1]}${time[2]}${time[3]}${time[4]}${time[5]}`;

        const aHistory = {
            sender: sender,
            receiver: receiver,
            callDate: callDate,
            status: status,
            deepfake: deepfake,
            room_id: room_id
        }

        historyList.push(aHistory);
    }

    return historyList;
}

async function readFile(fileName) {
    // Define the path to your text file
     const filePath = path.join(__dirname, 'education_content', fileName + '.txt');

     try {
        // Read the file content as a string
        const data = await fs.readFile(filePath, 'utf8');
        return data;
      } catch (err) {
        console.error('Error reading the file:', err);
      }
 }

async function generateEducation() {
    const lessonName = [
        'Understanding Audio Deepfakes The New Frontier of Fraud',
        'Securing Social Media Accounts A Comprehensive Guide',
        'Recognizing Fake Websites A Guide to Staying Safe Online',
        'Identifying Phishing Emails Essential Tips for Staying Safe',
        'Reporting and Blocking Spam Emails and Messages',
        'Staying Safe Online The Importance of User Awareness',
        'The Importance of Regular Software Updates',
        'Understanding Privacy Settings'
    ]

    const contentList = [];

    for (let i = 0; i < lessonName.length; i++) {
        const aContent = {
            title: lessonName[i],
            content: await readFile(lessonName[i])
        }

        contentList.push(aContent);
    } 
    return contentList;
}

module.exports = {
    generateUsers,
    generateContacts,
    generateCallHistory,
    generateEducation
}