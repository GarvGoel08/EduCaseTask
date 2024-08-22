const express = require('express');
const app = express();
const env = require('dotenv');

env.config();

const Routes = require('./route');

app.use(express.json());
app.use('/api', Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
