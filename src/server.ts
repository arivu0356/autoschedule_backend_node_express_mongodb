import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { Server, Socket } from 'socket.io';

const rfs = require('rotating-file-stream');

//include
import config from '@config/index';
import Logging from '@includes/logging';
import Routes from '@routes/index';

// create app
const app = express();

//log
var accessLogStream = rfs.createStream('access.log', {
    size: '10M'
});
app.use(morgan('combined', { stream: accessLogStream }));

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    // middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Setup CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    /** home */
    app.get('/', (req, res) => {
        return res.status(200).json({
            status: 'Welcome AutoShifts v1.0.0'
        });
    });

    app.use('/api', Routes);
    /** Error handling */
    app.use((req, res) => {
        return res.status(404).json({
            error: 'API Not Found'
        });
    });

    // listen
    let client = http.createServer(app).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
    // socket io
    const io = new Server(client);
    app.set('socketio', io);
};

// Connect to Mongo
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => Logging.error(error));
