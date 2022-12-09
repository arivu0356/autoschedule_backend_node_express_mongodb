import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import { ErrorAuthResponse } from '@includes/response';
import Common from '@includes/common';

export const Protect = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token = Common.jwtParseToken(req);

        if (!token || token === 'null') {
            ErrorAuthResponse(res, 'token_not_found');
            return;
        }

        try {
            jwt.verify(token, config.jwt.secret);
            next();
        } catch (err) {
            ErrorAuthResponse(res, 'token_expired');
        }
    };
};
