const Education = require('../Class_Entity/Education');

class Education_Controller {
    /**
     * Retrieves a list of educational titles.
     *
     * @returns {Promise<Array>} - Returns a promise that resolves to an array of educational titles.
     * @throws {Error} - Throws an error if there is an issue retrieving the educational titles.
     */
    async getEducationalTitles() {
        try {
            const educationTitles = await Education.getTitle();
            return educationTitles;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Retrieves the content of a specific educational title by its ID.
     *
     * @param {number} education_id - The ID of the educational title.
     * @returns {Promise<Object>} - Returns a promise that resolves to the content of the educational title.
     * @throws {Error} - Throws an error if there is an issue retrieving the educational content.
     */
    async getEducationalContents(education_id) {
        try {
            const educationCotents = await Education.getContent(education_id);
            return educationCotents[0];
        } catch(error) {
            throw error;
        }
    }
}

module.exports = Education_Controller;