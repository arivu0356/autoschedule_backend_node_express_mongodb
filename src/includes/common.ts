import Bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { Request } from 'express';
import { AES, enc } from 'crypto-js';

//include
import config from '@config/index';

const Common = {
    encrypt: async (str: string) => {
        const salt = await Bcrypt.genSalt(10);
        return await Bcrypt.hash(str, salt);
    },
    encryptMatch: async (str1: any, str2: any) => {
        return await Bcrypt.compare(str1, str2);
    },
    authInfo: (req: Request) => {
        return Jwt.decode(Common.jwtParseToken(req));
    },
    // Sign JWT and return
    jwtParseToken: (req: Request) => {
        let data = '';
        const { authorization } = req.headers;
        if (authorization?.startsWith('Bearer')) {
            data = authorization.split(' ')[1];
        }
        return data;
    },
    jwtToken: async (id: any, role: string, type: string) => {
        return Jwt.sign({ id, role, type }, config.jwt.secret, {
            expiresIn: config.jwt.expire
        });
    },
    // generate refresh token
    jwtRefreshToken: async (id: any, role: string, type: string) => {
        return Jwt.sign({ id, role, type }, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpire
        });
    },
    uniqueCode: (length: number, numberOnly: boolean = false) => {
        var result = '';
        var characters = numberOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    crypt(data: string) {
        const cipherText = AES.encrypt(data, '#cErLyPpKt#').toString();
        return cipherText;
    }
};

export default Common;
