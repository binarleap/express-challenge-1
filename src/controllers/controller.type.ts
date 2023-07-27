import {Request} from 'express';

export interface ResponseType {
    errors: any,
    data: any,
    code: 200 | 400 | 401 | 404 | 403 | 500 | 503,
    message: string
}

export interface TypedRequest<T> extends Request {
    body: T
}

export interface SetCookieOptions {
    secure: boolean
    httpOnly: boolean
    expires: Date
}
