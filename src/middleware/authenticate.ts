import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import Controller from "../controllers/controller.js";
import _ from 'lodash'
import dayjs from "dayjs";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const controller = new Controller(req, res);
    const accessToken = _.get(req.headers, 'authorization', null);
    const refreshToken = _.get(req.cookies, 'refreshToken', null);

    if (!accessToken && !refreshToken) {
        controller.makeUnauthorizedError()
        return controller.makeResponse()
    }

    try {
        const decoded = jwt.verify(accessToken ?? '', process.env.AUTH_SECRET ?? '');
        req.user = _.get(decoded, 'id', {});
        next();
    } catch (error) {
        if (!refreshToken) {
            controller.makeUnauthorizedError()
            return controller.makeResponse()
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.AUTH_SECRET ?? '');
            const accessToken = jwt.sign({ user: _.get(decoded, 'id', {}) }, process.env.AUTH_SECRET ?? '', { expiresIn: '1h' });

            controller.setCookie("accessToken", accessToken, {
                secure: false,
                httpOnly: true,
                expires: dayjs().add(60, "minutes").toDate()
            });

            controller.makeResponse()
        } catch (error) {
            controller.makeUnauthorizedError()
            return controller.makeResponse()
        }
    }
}
