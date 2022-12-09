import { Response } from 'express';
import Message from './message';

const SuccessResponse = async (res: Response, data: any) => {
    res.status(200).json(data);
};

const ErrorResponse = async (res: Response, error: string, code: string = '') => {
    let err: any = Message.error;
    res.status(500).json({ error: err[error], code });
};

const ErrorAuthResponse = async (res: Response, error: string) => {
    let err: any = Message.error;
    res.status(401).json({ error: err[error] });
};

const ErrorPayloadResponse = async (res: Response, error: string) => {
    res.status(400).json({ error: error });
};

const ErrorDbResponse = async (res: Response, error: any) => {
    res.status(400).json({ error: error.message });
};

export { SuccessResponse, ErrorResponse, ErrorAuthResponse, ErrorPayloadResponse, ErrorDbResponse };
