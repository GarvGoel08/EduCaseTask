const express = require('express');
const app = express();
const env = require('dotenv');

env.config();

const Routes = require('./route');

app.use(express.json());
app.use('/api', Routes);

app.get('/', (req, res) => {
    res.send("Welcome to the School API. Hit /api/addSchool to add a school and /api/listSchools to list schools.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
