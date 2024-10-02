const moment = require('moment-timezone');

class ServiceTime {
    constructor() {}

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

    /**
     * Converts a date to a formatted string in 'DD/MM/YYYY' format based on the Australia/Sydney timezone.
     *
     * @param {string|null} dateToConvert - The date string to be converted. If null, returns null.
     * @returns {string|null} - The formatted date string in 'DD/MM/YYYY' format or null if the input is null.
     */
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