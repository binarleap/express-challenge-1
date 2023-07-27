import _ from 'lodash';
import {ResponseType, SetCookieOptions} from "./controller.type";
import {Request, Response} from "express";
import validator from 'validator';

// controller class to make life easier!
class Controller {
    private readonly req;
    private readonly res;
    public readonly response: ResponseType;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.response = {
            errors: {},
            data: {},
            code: 200,
            message: '',
        };
    }

    // filter required values
    filterEmptyQuery(fields: string[]): void {
        for (const field of fields) {
            if (validator.isEmpty(`${this.req.query[field] ?? ''}`)) {
                this.makeError(field, `${field} is required`)
            }
        }
    }

    // filter required values
    filterEmpty(fields: string[]): void {
        for (const field of fields) {
            if (validator.isEmpty(`${this.req.body[field] ?? ''}`)) {
                this.makeError(field, `${field} is required`)
            }
        }
    }

    // validate email address
    isEmailAddress(email: string): boolean {
        return validator.isEmail(`${email}`)
    }

    // validate dummy coordinate
    isDummyCoordinate(latitude: string, longitude: string): boolean {
        return validator.isLatLong(`${latitude},${longitude}`)
    }

    // make an error in the response object
    makeError(field: string, error: string): void {
        this.response.errors[field] = error
    }

    // check if we do not have any errors
    canProceed(): boolean {
        return (Object.keys(this.response.errors).length === 0 && this.response.code === 200)
    }

    // make server error 500
    makeServerError(): void {
        this.response.message = "A server error occurred. Please try again."
        this.response.code = 500;
    }
    // make unauthorized error 401
    makeUnauthorizedError(): void {
        this.response.message = "Access Denied."
        this.response.code = 401;
    }

    // set a cookie in the header
    setCookie(name: string, value: string, options: SetCookieOptions): void {
        this.res.cookie(name, value, {
            ...options,
            encode: String
        });
    }

    // make the response object
    makeResponse() {
        return this.res.status(Object.keys(this.response.errors).length > 0 ? 400 : this.response.code).json({
            errors: _.mapKeys(this.response.errors, (v, k) => _.camelCase(k)),
            data: _.mapKeys(this.response.data, (v, k) => _.camelCase(k)),
            message: this.response.message
        })
    }
}

export default Controller;
