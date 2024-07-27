const moment = require('moment-timezone');

class ServiceTime {
    constructor() {}

    getServerTime() {
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
    }

    convertDate(dateToConvert) {
        if (dateToConvert === null) {
            return null;
        }
        const convertedDate = moment.tz(dateToConvert, 'ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)', 'Australia/Sydney');
        const formattedDate = convertedDate.format('DD/MM/YYYY');
        return formattedDate;
    }
}

module.exports = ServiceTime;