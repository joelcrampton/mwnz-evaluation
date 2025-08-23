import express from 'express';
import comaniesRouter from './routes/companies';

const app = express();

app.use('/v1/companies', comaniesRouter);

export default app;