const express = require('express');
const cors = require('cors');
// Security Middlewares
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const proposalRoutes = require('./routes/proposal.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Security Middlewares
app.use(helmet());
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://skillbridge-india.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'SkillBridge India API is running...' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

module.exports = app;
