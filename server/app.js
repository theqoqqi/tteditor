import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initRoutes from './routes.js';

export default function createApp() {

    const app = express();

    // noinspection JSCheckFunctionSignatures
    app.use(cors());

    app.use(bodyParser.json({
        limit: '100mb',
    }));

    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    initRoutes(app);

    return app;
};