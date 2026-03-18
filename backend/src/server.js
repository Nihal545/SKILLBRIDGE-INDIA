const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');
const app = require('./app');

// Connect Database and Seed Admin
connectDB().then(() => {
    seedAdmin();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
