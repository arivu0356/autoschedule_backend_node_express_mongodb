import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
//Includes
import { SuccessResponse, ErrorResponse, ErrorDbResponse } from '@includes/response';
import Common from '@includes/common';
import { AutoShiftAlg } from '@includes/function';
//Module
import Calendar from '@models/Calendar';
import User from '@models/User';
import mongoose from 'mongoose';

const Create = async (req: Request, res: Response, next: NextFunction) => {
    let data: any = req.body;
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        data.userId = decode?.id;
        let gtStartDateErr = await Calendar.find({ StartTime: { $lte: new Date(data.StartTime) }, EndTime: { $gte: new Date(data.StartTime) }, position: { $in: [data.position] } });
        if (gtStartDateErr.length) {
            error = 'already_schedule';
            // console.log({ gtStartDateErr });
        }
        if (!error) {
            let gtEndDateErr = await Calendar.find({ StartTime: { $lte: new Date(data.EndTime) }, EndTime: { $gte: new Date(data.EndTime) }, position: { $in: [data.position] } });
            if (gtEndDateErr.length) {
                error = 'already_schedule';
                // console.log({ gtEndDateErr });
            }
        }
        if (error) {
            ErrorResponse(res, error);
        } else {
            let cal = new Calendar(data);
            await cal.save();
            SuccessResponse(res, []);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Show = async (req: Request, res: Response, next: NextFunction) => {
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        let operation: any = decode?.role === 'manager' ? {} : { isPublished: true, employee: { $in: [new mongoose.Types.ObjectId(decode.id)] } };

        console.log(operation);
        // let result = await Calendar.find(operation)
        //     .populate({
        //         path: 'position employee',
        //         select: 'name'
        //     })
        //     .select('position')
        //     .lean();

        let result = await Calendar.aggregate([
            {
                $lookup: {
                    from: 'positions',
                    localField: 'position',
                    foreignField: '_id',
                    as: 'position'
                }
            },

            {
                $match: operation
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    Date: 1,
                    StartTime: 1,
                    EndTime: 1,
                    isPublished: 1,
                    'position.name': 1,
                    'employee.email': 1
                }
            }
        ]);

        SuccessResponse(res, result);
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const AutoShift = async (req: Request, res: Response, next: NextFunction) => {
    let data: any = req.body;
    const decode: any = Common.authInfo(req);
    try {
        let error = '';
        data.userId = decode?.id;
        AutoShiftAlg();

        if (error) {
            ErrorResponse(res, error);
        } else {
            SuccessResponse(res, []);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

const Published = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let error = '';
        if (error) {
            ErrorResponse(res, error);
        } else {
            await Calendar.updateMany({ isPublished: false }, { isPublished: true });
            SuccessResponse(res, []);
        }
    } catch (error) {
        ErrorDbResponse(res, error);
    }
};

export default { Create, AutoShift, Show, Published };
