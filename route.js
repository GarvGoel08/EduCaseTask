const { Router } = require('express');
const router = Router();
const { addSchool, listSchools } = require('./controller');

router.get('/', (req, res) => {
    res.send("Welcome to the School API. Hit /addSchool to add a school and /listSchools to list schools.");
});
router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;