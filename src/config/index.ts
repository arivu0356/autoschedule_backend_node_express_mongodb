import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    mongo: {
        username: process.env.MONGO_USERNAME || '',
        password: process.env.MONGO_PASSWORD || '',
        url: process.env.MONGO_URL || ''
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expire: process.env.JWT_EXPIRE || '',
        refreshSecret: process.env.JWT_REFRESH_SECRET || '',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || ''
    }
};

export default config;
