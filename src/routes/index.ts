import express from 'express';
//includes
import AppRouter from '@routes/app';

const Routes = express.Router();

Routes.use('/app', AppRouter);

export default Routes;
