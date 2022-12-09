import { NextFunction, Request, Response } from 'express';

//Includes
import { SuccessResponse, ErrorResponse, ErrorDbResponse } from '@includes/response';
import Common from '@includes/common';
//Module
import Employee from '@models/User';

const Index = async (req: Request, res: Response, next: NextFunction) => {
    const decode: any = Common.authInfo(req);
    try {
        let result = await Employee.find({ role: 'employee' });
        SuccessResponse(res, result);
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Show = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        let error = '';
        let result = await Employee.findOne({ _id: id });
        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, result);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Create = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = req.body;
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        data.createdBy = decode?.id;
        data.role = 'employee';
        data.password = await Common.encrypt(data.password);
        let Emp = new Employee(data);
        await Emp.save();
        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, []);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Update = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = req.body;
    const { id } = req.params;
    try {
        let error = '';
        let result = await Employee.findOneAndUpdate({ _id: id }, data);
        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, result);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

export default { Index, Create, Update, Show };
