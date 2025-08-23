import express from 'express';
import comaniesRouter from './routes/companies';

const app = express();

// Handle any requests using /v1/companies using companiesRouter
app.use('/v1/companies', comaniesRouter);

export default app;