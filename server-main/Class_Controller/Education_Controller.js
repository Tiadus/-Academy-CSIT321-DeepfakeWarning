const Education = require('../Class_Entity/Education');

class Education_Controller {
    async getEducationalTitles() {
        try {
            const educationTitles = await Education.getTitle();
            return educationTitles;
        } catch(error) {
            throw error;
        }
    }

    async getEducationalContents(education_id) {
        try {
            const educationCotents = await Education.getContent(education_id);
            return educationCotents;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = Education_Controller;