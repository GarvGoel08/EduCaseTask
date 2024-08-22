const { Router } = require('express');
const router = Router();
const { addSchool, listSchools } = require('./controller');

router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;