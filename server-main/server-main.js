const { exec } = require('child_process');

const APP_CONFIG = require('./server-main-config.js');
const server_main_port = APP_CONFIG.server_main_port;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const { Readable } = require('stream');

const User_Controller = require('./Class_Controller/User_Controller.js');
const Education_Controller = require('./Class_Controller/Education_Controller.js');
const Call_History = require('./Class_Entity/Call_History.js');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the audio files directory exists to store audio from conversation for analysis
const audioFileDir = path.join(__dirname, 'audio_files');
if (!fs.existsSync(audioFileDir)) {
  fs.mkdirSync(audioFileDir);
}

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Check if the log file exists, create it if not
if (!fs.existsSync('log.txt')) {
  // File doesn't exist, create it
  fs.writeFileSync('log.txt', '');
  console.log('File created!');
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Naming the file with a unique name
  },
});

const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Retrieve the path of the uploaded file
    const filePath = path.join(uploadDir, req.file.filename);

    const result = await analyseFile(filePath);

    // Send a success response with the file path
    res.json({
      message: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'File upload failed',
      error: err.message,
    });
  }
});

/**
 * Analyzes a file for deepfake content using a Python script.
 *
 * This function executes a Python script that assesses a given file and returns a classification
 * of the content based on its analysis score.
 *
 * @param {string} filePath - The path to the file to be analyzed.
 *
 * @throws {Error} Throws an error if:
 *                  - There is an issue running the Python script or if the script returns an error.
 *
 * @returns {Promise<string>} Returns a promise that resolves to a string indicating whether
 *                            the file is classified as 'Deepfake' or 'Safe'.
 *                            - Returns 'Deepfake' if the evaluation score is greater than -1.5.
 *                            - Returns 'Safe' if the evaluation score is less than or equal to -1.5.
 */
async function analyseFile(filePath) {
  const pythonScriptPath = 'main.py';

  const command = `python ${pythonScriptPath} --single_file ${filePath}`;

  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error analyzing file: ${error.message}`);
        } else if (stderr) {
          reject(`Python script error: ${stderr}`);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });

    const evaluatedScore = parseFloat(stdout);
    console.log(`File Uploaded Score: ${evaluatedScore}`);

    if (evaluatedScore > APP_CONFIG.model_file_boundary) {
      return ('Deepfake');
    } else {
      return ('Safe');
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @api {post} /api/register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} user_name User's chosen username.
 * @apiParam {String} phone User's phone number.
 * @apiParam {String} user_password User's password.
 *
 * @apiError (400) BadRequest The request is missing required fields.
 * @apiError (500) InternalServerError An error occurred while registering the user.
 *
 * @apiSuccess {Number} newUserID The ID of the newly registered user.
 *
 * @apiExample {json} Example usage:
 * {
 *     "email": "user@example.com",
 *     "user_name": "user123",
 *     "phone": "1234567890",
 *     "user_password": "password123"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "newUserID": 1
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.post('/api/register', async (req,res) => {
  const body = req.body;
  const email = body.email;
  const user_name = body.user_name;
  const phone = body.phone;
  const user_password = body.user_password;

  if (email === undefined || user_name === undefined || phone === undefined || user_password === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      const newUserID = await userController.registerUser(email, user_name, 'default.jpg', phone, user_password);
      res.json({newUserID: newUserID});
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

const decodeCredential = (encodedCredential) => {
  try {
    const decodedCredential = atob(encodedCredential);
    return decodedCredential;
  } catch(error) {
    console.log(error);
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 409;
    throw badRequestError;
  }
}

/**
 * @api {post} /api/login User Login
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Basic authentication credentials in the format `Basic <encoded_credentials>`.
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiError (400) BadRequest The request is missing required fields or the authorization header.
 * @apiError (401) Unauthorized Invalid email or password.
 * @apiError (500) InternalServerError An error occurred while processing the login.
 *
 * @apiSuccess {Number} user_id The ID of the authenticated user.
 * @apiSuccess {String} email The email of the authenticated user.
 * @apiSuccess {String} user_name The username of the authenticated user.
 * @apiSuccess {String} avatar The avatar URL of the authenticated user.
 * @apiSuccess {String} phone The phone number of the authenticated user.
 *
 * @apiExample {json} Example usage:
 * {
 *   "Authorization": "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw=="
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user_id": 1,
 *       "email": "user@example.com",
 *       "user_name": "user123",
 *       "avatar": "user1.jpg",
 *       "phone": "1234567890"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 */
app.post('/api/login', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = decodeCredential(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    res.json({
      user_id: userController.user.userID,
      email: userController.user.email,
      user_name: userController.user.user_name,
      avatar: userController.user.avatar,
      phone: userController.user.phone
    });
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

/**
 * @api {post} /api/profile Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Basic authentication credentials in the format `Basic <encoded_credentials>`.
 *
 * @apiParam {String} mode Operation mode: `edit` for editing the profile.
 * @apiParam {String} [email] New email address (optional).
 * @apiParam {String} [user_name] New username (optional).
 * @apiParam {String} [avatar] New avatar URL (optional).
 * @apiParam {String} [phone] New phone number (optional).
 * @apiParam {String} [user_password] Current password for verification (optional).
 * @apiParam {String} [user_password] New password (optional).
 *
 * @apiError (400) BadRequest The request is missing required fields or the authorization header.
 * @apiError (401) Unauthorized Invalid email or password.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess {Object} user The updated user object.
 *
 * @apiExample {json} Example usage:
 * {
 *   "Authorization": "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==",
 *   "mode": "edit",
 *   "email": "new_email@example.com",
 *   "user_name": "new_username",
 *   "avatar": "new_avatar.jpg",
 *   "phone": "0987654321",
 *   "user_password": "current_password",
 *   "user_password": "new_password"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "user_id": 1,
 *         "email": "new_email@example.com",
 *         "user_name": "new_username",
 *         "avatar": "new_avatar.jpg",
 *         "phone": "0987654321"
 *       }
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.post('/api/profile', async (req, res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
      return res.send("Server Unavailable");
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  const mode = req.body.mode;
  const email = req.body.email;
  const user_name = req.body.user_name;
  const avatar = req.body.avatar;
  const phone = req.body.phone;
  const user_password = req.body.user_password;

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);
      const user = await userController.userEditProfile(mode, email, user_name, avatar, phone, userPassword, user_password);

      res.json({user: user})
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({error: error.message});
    } else {
        const internalServerError = new Error('Internal Server Error');
        internalServerError = 500;
        throw internalServerError;
    }
  }
});

/**
 * @api {get} /api/contact Get User Contacts
 * @apiName GetUserContacts
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Basic authentication credentials in the format `Basic <encoded_credentials>`.
 *
 * @apiParam {String} name The name to search for in the user's contacts.
 *
 * @apiError (400) BadRequest The request is missing required fields or the authorization header.
 * @apiError (401) Unauthorized. Invalid email or password.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess {Object[]} contacts List of contacts matching the search criteria.
 * @apiSuccess {String} contacts.user_id The ID of the contact.
 * @apiSuccess {String} contacts.user_name The name of the contact.
 * @apiSuccess {String} contacts.avatar The avatar URL of the contact.
 *
 * @apiExample {json} Example usage:
 * {
 *   "Authorization": "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==",
 *   "name": "John"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "contacts": [
 *         {
 *           "user_id": 1,
 *           "user_name": "John Doe",
 *           "avatar": "john_doe.jpg"
 *         },
 *         {
 *           "user_id": 2,
 *           "user_name": "John Smith",
 *           "avatar": "john_smith.jpg"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 */
app.get('/api/contact', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  if (userEmail === undefined || userPassword === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const name = req.query.name;
  if (name === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
    return;
  }

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);

      const contacts = await userController.getUserContacts(name);
      res.json({contacts: contacts});
  } catch (error) {
      if (error.status) {
        res.status(error.status).json({error: error.message});
      } else {
        res.status(500).json({error: 'Internal Server Error'});
      }
  }
});

/**
 * @api {post} /api/contact Manage User Contacts
 * @apiName ManageUserContacts
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Basic authentication credentials in the format `Basic <encoded_credentials>`.
 *
 * @apiParam {String} mode The mode of operation: either `add` to add a contact or `del` to delete a contact.
 * @apiParam {Number} contact_id The ID of the contact to be added or deleted.
 *
 * @apiError (400) BadRequest The request is missing required fields or the authorization header.
 * @apiError (401) Unauthorized Invalid email or password.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {String} message Confirmation message of the action performed.
 *
 * @apiExample {json} Example usage:
 * {
 *   "Authorization": "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==",
 *   "mode": "add",
 *   "contact_id": 123
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Contact Successfully Added"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.post('/api/contact', async (req,res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const body = req.body;
    const mode = body.mode;
    const contact_id = body.contact_id;

    if (mode === undefined || contact_id === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (mode !== 'add' && mode !== 'del') {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (isNaN(contact_id) === true) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    if (mode === 'add') {
      const manageContactResult = await userController.userAddContact(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Contact Successfully Added' });
    } else if (mode === 'del') {
      const manageContactResult = await userController.userDeleteContact(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Contact Successfully Deleted' });
    }
  } catch (error) {
    res.status(error.status).json({error: error.message});
  }
});

/**
 * @api {get} /api/user Search Users
 * @apiName SearchUsers
 * @apiGroup User
 *
 * @apiParam {String} name The name of the user to search for.
 *
 * @apiError (400) BadRequest The request is missing the required `name` query parameter.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {Object[]} users List of users matching the search criteria.
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET "http://example.com/api/user?name=John"
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [
 *         {
 *           "user_id": 1,
 *           "user_name": "John Doe",
 *           "email": "john@example.com"
 *         },
 *         {
 *           "user_id": 2,
 *           "user_name": "Johnny Appleseed",
 *           "email": "johnny@example.com"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.get('/api/user', async (req,res) => {
  const name = req.query.name;
  if (name === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      const users = await userController.userSearchUser(name);
      res.json({users: users});
  } catch (error) {
      if (error.status) {
        res.status(error.status).json({error: error.message});
      } else {
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'});
      }
  }
});

/**
 * @api {post} /api/user Manage User Actions
 * @apiName ManageUserActions
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Basic authentication header.
 *
 * @apiParam {String} mode The action to perform (`block` or `report`).
 * @apiParam {Number} contact_id The ID of the contact to block or report.
 * @apiParam {Number} [blockStatus] The status for blocking the contact (1 for block, 0 for unblock).
 *
 * @apiError (400) BadRequest The request is missing required parameters or contains invalid data.
 * @apiError (401) Failed Authentication. Invalid Credential.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {String} message Success message indicating the action was performed.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Block Status Successfully Changed"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.post('/api/user', async (req, res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    if (userEmail === undefined || userPassword === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const body = req.body;
    const mode = body.mode;
    const contact_id = body.contact_id;
    const blockStatus = body.blockStatus;

    if (mode === undefined || contact_id === undefined) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (mode !== 'block' && mode !== 'report') {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }
  
    if (isNaN(contact_id) === true) {
      const badRequestError = new Error('Bad Request');
      badRequestError.status = 400;
      res.status(badRequestError.status).json({error: badRequestError.message});
    }

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    if (mode === 'block') {
      if (blockStatus === undefined) {
        const badRequestError = new Error('Bad Request');
        badRequestError.status = 400;
        res.status(badRequestError.status).json({error: badRequestError.message});
      }

      if (isNaN(blockStatus) === true) {
        const badRequestError = new Error('Bad Request');
        badRequestError.status = 400;
        res.status(badRequestError.status).json({error: badRequestError.message});
      }

      const manageContactResult = await userController.userSetBlockStatus(parseInt(blockStatus), parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'Block Status Successfully Changed' });
    } else if (mode === 'report') {
      const manageContactResult = await userController.userReport(parseInt(contact_id));
      res.status(manageContactResult).send({ message: 'User Successfully Reported' });
    }
  } catch (error) {
    if (error.status !== undefined) {
      res.status(error.status).json({error: error.message});
    } else {
      console.log(error);
      const internalServerError = new Error('Internal Server Error');
      internalServerError.status = 500;
      res.status(internalServerError.status).json({error: internalServerError.message});
    }
  }
});

/**
 * @api {get} /api/statistic Get User Statistics
 * @apiName GetUserStatistics
 * @apiGroup Statistic
 *
 * @apiHeader {String} Authorization Basic authentication header.
 *
 * @apiError (400) BadRequest The request is missing required parameters or contains invalid data.
 * @apiError (403) Failed Authentication. Invalid Credential.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {Object} statistic The statistics of the authenticated user.
 * @apiSuccess (200) {Number} statistic.calls Total number of calls made by the user.
 * @apiSuccess (200) {Number} statistic.contacts Total number of contacts for the user.
 * @apiSuccess (200) {Number} statistic.blocked_contacts Total number of blocked contacts.
 * @apiSuccess (200) {Number} statistic.reported_contacts Total number of reported contacts.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statistic": {
 *         "calls": 10,
 *         "contacts": 50,
 *         "blocked_contacts": 5,
 *         "reported_contacts": 2
 *       }
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.get('/api/statistic', async (req,res) => {
  const authen = req.headers.authorization;
  if (authen === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  const encodedCredential = authen.split(" ")[1];
  const decodedCredential = atob(encodedCredential);

  const authenParts = decodedCredential.split(":");
  const userEmail = authenParts[0];
  const userPassword = authenParts[1];

  if (userEmail === undefined || userPassword === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const userController = new User_Controller();
      await userController.authenticateUser(userEmail, userPassword);

      const statistic = await userController.getUserStatistic();
      res.json({statistic: statistic});
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

/**
 * @api {get} /api/education Get Educational Titles or Content
 * @apiName GetEducationalData
 * @apiGroup Education
 *
 * @apiParam {String} mode The mode of the request, either 'title' or 'content'.
 * @apiParam {Number} [id] The ID of the educational content (required if mode is 'content').
 *
 * @apiError (400) BadRequest The request is missing required parameters or contains invalid data.
 * @apiError (401) Failed Authentication. Invalid Credential.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {Object[]} titles List of educational titles.
 * @apiSuccess (200) {Object} contentBody The educational content corresponding to the given ID.
 *
 * @apiExample {curl} Example usage for getting titles:
 *     curl -X GET "http://example.com/api/education?mode=title"
 *
 * @apiExample {curl} Example usage for getting content:
 *     curl -X GET "http://example.com/api/education?mode=content&id=1"
 *
 * @apiSuccessExample {json} Success-Response for titles:
 *     HTTP/1.1 200 OK
 *     {
 *       "titles": [
 *         {"id": 1, "title": "Introduction to Programming"},
 *         {"id": 2, "title": "Advanced JavaScript"}
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response for content:
 *     HTTP/1.1 200 OK
 *     {
 *       "contentBody": {
 *         "id": 1,
 *         "title": "Introduction to Programming",
 *         "body": "This course covers the cybersecurity."
 *       }
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
app.get('/api/education', async (req,res) => {
  const mode = req.query.mode;
  const id = req.query.id;

  if (mode === undefined) {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  if (mode !== 'title' && mode !== 'content') {
    const badRequestError = new Error('Bad Request');
    badRequestError.status = 400;
    res.status(badRequestError.status).json({error: badRequestError.message});
  }

  try {
      const educationController = new Education_Controller();

      if (mode === 'title') {
        const titles = await educationController.getEducationalTitles();
        res.json({titles: titles});
      }

      if (mode === 'content') {
        if (id === undefined) {
          const badRequestError = new Error('Bad Request');
          badRequestError.status = 400;
          res.status(badRequestError.status).json({error: badRequestError.message});
        }

        if (isNaN(id) === true) {
          const badRequestError = new Error('Bad Request');
          badRequestError.status = 400;
          res.status(badRequestError.status).json({error: badRequestError.message});
        }

        const contents = await educationController.getEducationalContents(parseInt(id));
        res.json({contentBody: contents});
      }
  } catch (error) {
      res.status(error.status).json({error: error.message});
  }
});

/**
 * @api {post} /api/communication Manage User Communication
 * @apiName PostCommunication
 * @apiGroup Communication
 *
 * @apiHeader {String} Authorization Bearer <token> for user authentication.
 *
 * @apiParam {Object} body The body of the request containing communication details.
 * @apiParam {String} body.mode The mode of communication (`initiate` or `receive`).
 * @apiParam {Number} [body.receiver_id] The ID of the receiver (required for `initiate`).
 * @apiParam {Number} [body.room_id] The ID of the communication room (required for `receive`).
 * @apiParam {String} [body.receiver_action] Action for the receiver (required for `receive`).
 *
 * @apiError (400) Bad request due to missing parameters.
 * @apiError (500) InternalServerError An error occurred while processing the request.
 *
 * @apiSuccess (200) {String} room_id The ID of the communication room established.
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST "http://example.com/api/communication" \
 *     -H "Authorization: Bearer <token>" \
 *     -d '{"mode":"initiate", "receiver_id": 123}'
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "room_id": "abcd1234"
 *     }
 *
 * @apiErrorExample {json} Error-Response:

 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
app.post('/api/communication', async (req,res) => {
  try {
    const authen = req.headers.authorization;
    if (authen === undefined) {
      res.status(400).json({error: 'Bad Request'});
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);
  
    const authenParts = decodedCredential.split(":");
    const userEmail = authenParts[0];
    const userPassword = authenParts[1];

    const body = req.body;

    const userController = new User_Controller();
    await userController.authenticateUser(userEmail, userPassword);

    const room_id = await userController.handleCommunication(body, clients);

    res.status(200).json({room_id: room_id});
    
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal Server Error"});
    }
  }
}) 

/**
 * Retrieves the current server date and time.
 *
 * @returns {Object} - An object containing the current year, month, day, hour, minute, and second.
 * @returns {number} return.year - The current year.
 * @returns {string} return.month - The current month (zero-padded).
 * @returns {string} return.day - The current day of the month (zero-padded).
 * @returns {string} return.hour - The current hour (zero-padded).
 * @returns {string} return.minute - The current minute (zero-padded).
 * @returns {string} return.second - The current second (zero-padded).
 */
const getServerTime = () => {
  // Get the current date and time
  const currentDate = new Date();

  // Extract date and time components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getSeconds()).padStart(2, '0');

  return ({
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second
  })
};

/**
 * Saves an audio record to a file in FLAC format.
 * @param {string} message - The audio message in binary format.
 * @param {string} clientID - The ID of the client uploading the audio.
 * @returns {Promise<string>} A promise that resolves with the file name of the saved audio.
 */
async function saveAudioRecordToFile(message, clientID) {
  const serverTime = getServerTime();

  const buffer = Buffer.from(message, 'binary');

  const audioStream = new Readable();
  audioStream.push(buffer);
  audioStream.push(null);

  const fileName = `C${clientID}T${serverTime.year}${serverTime.month}${serverTime.day}${serverTime.hour}${serverTime.minute}${serverTime.second}.flac`;
  const filePath = path.join(__dirname, 'audio_files', fileName); // __dirname gives the directory of the current module

  ffmpeg(audioStream)
  .audioChannels(1)
  .outputFormat('flac')
  .on('error', (err) => {
      console.error('Error during conversion:', err);
  })
  .on('end', () => {
    console.log('Conversion Complete - File Name: ' + fileName);
  }).save(filePath);
  
  return fileName;
};

async function runModel(clientID, fileName, room_id, deepfake_status) {
  const pythonScriptPath = 'main.py';

  const filePath = 'audio_files/' + fileName;

  const command = `python ${pythonScriptPath} --single_file ${filePath}`;

  exec(command, async (error, stdout, stderr) => {
      if (error) {
          console.error(`Error analysing file: ${error.message}`);
          return 'Can Not Open File';
      }

      if (stderr) {
          console.error(`Python script error: ${stderr}`);
          return 'Internal Server Error';
      }

      const evaluatedScore = parseFloat(stdout);

      if (parseFloat(evaluatedScore) > APP_CONFIG.model_conversation_boundary[0] || parseFloat(evaluatedScore) < APP_CONFIG.model_conversation_boundary[1]) {
        console.log(`D:${fileName}:${parseFloat(evaluatedScore)}`);
    
        try{
          clients.forEach((client) => {
            if (client.id === clientID && client.readyState === WebSocket.OPEN) {
              const messageObj = {
                mode: 'analyse',
                result: 'deepfake'
              }
              client.deepfake = true;
              client.send(JSON.stringify(messageObj));
            }
          });

          if (deepfake_status === false) {
            await Call_History.flagCallHistory(true, clientID, room_id);
            console.log(`Call Flagged For User ${clientID} In Room ${room_id}`);
          }
        } catch (error) {
            console.log('Error occured while transmitting message to client with id: ' + clientID);
        }
      } else {
        console.log(`S:${fileName}:${parseFloat(evaluatedScore)}`);
      }

      // Append data to the file if the user has id 1 (The Victim)
      try {
        if (clientID == 1 || clientID == -15) {
          const dataToAppend = `${clientID}:${fileName}:${evaluatedScore}\n`;
          fs.appendFileSync('log.txt', dataToAppend);
          console.log('Data appended to file!');
        }
      } catch (error) {
        console.log(error)
      }
  });
};

async function analyse(clientID, message, room_id, deepfake_status) {
  let processedID = clientID;
  /*if (processedID < 0) {
    processedID *= -1;
  }*/
  const fileName = await saveAudioRecordToFile(message, processedID);
  await runModel(processedID, fileName, room_id, deepfake_status);
}

const clients = [];

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    if (isNaN(message) === true) {
      try {
        analyse(ws.id, message, ws.room, ws.deepfake);
      } catch (error) {
        console.log(error.message);
      }
    } else if (isNaN(message) === false) {
      let data = parseInt(message);
      ws.id = data;
      console.log(`WebSocket with ID: ${ws.id} connected`);
    }
  })

  ws.on('close', () => {
    console.log(`WebSocket with ID: ${ws.id} disconnected`);
    clients.splice(clients.indexOf(ws), 1);
  });

  clients.push(ws);
});

server.listen(server_main_port, function() {
  console.log("Server Main Online - Port: " + server_main_port);
});