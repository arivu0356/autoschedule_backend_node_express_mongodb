import { NextFunction, Request, Response } from 'express';

//Includes
import { SuccessResponse, ErrorResponse, ErrorDbResponse } from '@includes/response';
import Common from '@includes/common';
//Module
import User from '@models/User';

const Show = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = req.body;
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        let result = await User.findOne({ _id: decode?.id });
        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, result);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Update = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = req.body;
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        console.log({ data });
        let result = await User.findOneAndUpdate({ _id: decode?.id }, { ...data }, { new: true });
        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, result);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

export default { Update, Show };
