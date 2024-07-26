const fs = require('fs').promises;
const path = require('path');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function generateContacts() {
    let contactList = [];

    for (let i = 0; i < 14; i++) {
        const storer = 15;
        const stored = i+1;
        const blocked = false;

        const aContact = {
            storer: storer,
            stored: stored,
            blocked: blocked
        }

        contactList.push(aContact);
    }

    return contactList;
}

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

function generateCallHistory() {
    const historyList = [];

    for (let i = 1; i <=5; i++) {
        const sender = 15;
        const receiver = i;
        const status = getRandomInt(0,2);
        const deepfake = getRandomInt(0,1);

        const aHistory = {
            sender: sender,
            receiver: receiver,
            status: status,
            deepfake: deepfake
        }

        historyList.push(aHistory);
    }

    for (let i = 1; i <=5; i++) {
        const sender = i;
        const receiver = 15;
        const status = getRandomInt(0,2);
        const deepfake = getRandomInt(0,1);

        const aHistory = {
            sender: sender,
            receiver: receiver,
            status: status,
            deepfake: deepfake
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
        'Recognizing Fake Websites A Guide to Staying Safe Online'
    ]

    const contentList = [];

    for (let i = 0; i < 3; i++) {
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