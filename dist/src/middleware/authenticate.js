import jwt from "jsonwebtoken";
import Controller from "../controllers/controller.js";
import _ from 'lodash';
import dayjs from "dayjs";
export function authenticate(req, res, next) {
    var _a, _b, _c;
    const controller = new Controller(req, res);
    const accessToken = _.get(req.headers, 'authorization', null);
    const refreshToken = _.get(req.cookies, 'refreshToken', null);
    if (!accessToken && !refreshToken) {
        controller.makeUnauthorizedError();
        return controller.makeResponse();
    }
    try {
        const decoded = jwt.verify(accessToken !== null && accessToken !== void 0 ? accessToken : '', (_a = process.env.AUTH_SECRET) !== null && _a !== void 0 ? _a : '');
        req.user = _.get(decoded, 'id', {});
        next();
    }
    catch (error) {
        if (!refreshToken) {
            controller.makeUnauthorizedError();
            return controller.makeResponse();
        }
        try {
            const decoded = jwt.verify(refreshToken, (_b = process.env.AUTH_SECRET) !== null && _b !== void 0 ? _b : '');
            const accessToken = jwt.sign({ user: _.get(decoded, 'id', {}) }, (_c = process.env.AUTH_SECRET) !== null && _c !== void 0 ? _c : '', { expiresIn: '1h' });
            controller.setCookie("accessToken", accessToken, {
                secure: false,
                httpOnly: true,
                expires: dayjs().add(60, "minutes").toDate()
            });
            controller.makeResponse();
        }
        catch (error) {
            controller.makeUnauthorizedError();
            return controller.makeResponse();
        }
    }
}
