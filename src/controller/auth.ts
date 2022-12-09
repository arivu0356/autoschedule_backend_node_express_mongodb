import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import moment from 'moment';
//includes
import { ErrorDbResponse, ErrorResponse, SuccessResponse } from '@includes/response';
import Common from '@includes/common';

//models
import User from '@models/User';

const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        let error = '';
        let userResult: any = await User.findOne({ email }).lean();
        if (userResult) {
            if (!(await Common.encryptMatch(password, userResult.password))) {
                error = 'incorrect_password';
            }
        } else {
            error = 'account_not_found';
        }
        if (error) {
            ErrorResponse(res, error);
        } else {
            const { _id, firstName, lastName, email, role } = userResult;
            let resultData = {
                _id,
                firstName,
                lastName,
                email,
                role,
                token: await Common.jwtToken(_id, role, role),
                refreshToken: await Common.jwtRefreshToken(_id, role, role)
            };
            SuccessResponse(res, resultData);
        }
    } catch (error: any) {
        return ErrorDbResponse(res, error);
    }
};

const Register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, email, password } = req.body;
    try {
        let error = '';
        let userResult: any = await User.findOne({ email }).lean();
        if (userResult) {
            if (userResult?.isDeleted) {
                error = 'deleted_account';
            } else if (!userResult?.isActive) {
                error = 'account_inactive';
            } else {
                error = 'already_register';
            }
        }
        if (error) {
            ErrorResponse(res, error);
        } else {
            let otp = Common.uniqueCode(6, true);
            const UserModel = new User({
                email,
                password: await Common.encrypt(password),
                firstName,
                role: 'manager',
                otp,
                otpValidUpto: moment().add(1, 'days').format()
            });
            await UserModel.save();

            SuccessResponse(res, []);
        }
    } catch (error: any) {
        return ErrorDbResponse(res, error);
    }
};

const OtpGenerate = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        let error = '';
        let newOtp = Common.uniqueCode(6, true);
        let resetToken = Common.crypt(String(newOtp));
        let userResult: any = await User.findOne({ email }).sort({ createdAt: 'desc' }).limit(1).lean();
        if (!userResult) {
            error = 'account_not_found';
        }

        if (error) {
            ErrorResponse(res, error);
        } else {
            await User.findOneAndUpdate(
                { _id: userResult._id },
                {
                    otp: newOtp,
                    otpValidUpto: moment().add(1, 'days').format()
                }
            );
            let output = {
                resetToken: userResult.isVerified ? resetToken : null,
                isVerified: userResult.isVerified,
                role: userResult.role,
                token: userResult.isVerified ? await Common.jwtToken(userResult._id, userResult.role, userResult.role) : null,
                refreshToken: userResult.isVerified ? await Common.jwtRefreshToken(userResult._id, userResult.role, userResult.role) : null
            };
            SuccessResponse(res, output);
        }
    } catch (error) {
        return ErrorDbResponse(res, error);
    }
};

const OtpVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    try {
        let error = '';
        let userResult: any = await User.findOne({ email }).sort({ createdAt: 'desc' }).limit(1).lean();
        if (!userResult) {
            error = 'account_not_found';
        }
        if (userResult.otp !== otp && !(moment(userResult.otpValidUpto).format() > moment().format())) {
            error = 'in_valid_otp';
        }
        if (error) {
            ErrorResponse(res, error);
        } else {
            await User.findOneAndUpdate(
                { _id: userResult._id },
                {
                    isVerified: true,
                    otp: Common.uniqueCode(5)
                }
            );
            SuccessResponse(res, []);
        }
    } catch (error: any) {
        return ErrorDbResponse(res, error);
    }
};

export default { Login, Register, OtpGenerate, OtpVerify };
