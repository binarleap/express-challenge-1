import {Request} from 'express';
import { Query } from 'express-serve-static-core';

export interface ResponseType {
    errors: any,
    data: any,
    code: 200 | 400 | 401 | 404 | 403 | 500 | 503,
    message: string
}

export interface TypedRequest<T> extends Request {
    body: T
}

export interface TypedRequestQuery<T extends Query> extends Request {
    query: T
}

export interface TypedRequestQueryBody<T extends Query, U> extends Request {
    body: U,
    query: T
}

export interface SetCookieOptions {
    secure: boolean
    httpOnly: boolean
    expires: Date
}
