var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from '../../models/user.js';
import Controller from '../controller.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const controller = new Controller(req, res);
    const { email, password } = req.body;
    // filter required values
    controller.filterEmpty(['email', 'password']);
    if (controller.canProceed()) {
        // validate email address
        if (!controller.isEmailAddress(email)) {
            controller.makeError('email', 'Email address is not valid');
        }
    }
    if (controller.canProceed()) {
        try {
            // check user
            const user = yield User.findOne({
                email
            });
            // user is valid
            if (user) {
                // compare password
                if (yield bcrypt.compare(password, user.password)) {
                    // generate access token and set in cookie
                    let accessToken = jwt.sign({ id: user.id }, (_a = process.env.AUTH_SECRET) !== null && _a !== void 0 ? _a : '', { expiresIn: '1h' });
                    controller.setCookie("accessToken", accessToken, {
                        secure: false,
                        httpOnly: true,
                        expires: dayjs().add(60, "minutes").toDate()
                    });
                    // generate refresh token and set in cookie
                    const refreshToken = jwt.sign({ id: user.id }, (_b = process.env.AUTH_SECRET) !== null && _b !== void 0 ? _b : '', { expiresIn: '1d' });
                    controller.setCookie("refreshToken", refreshToken, {
                        secure: false,
                        httpOnly: true,
                        expires: dayjs().add(1, "day").toDate()
                    });
                    controller.response.message = 'Logged in successfully';
                    controller.response.data['user'] = user;
                    controller.response.data['accessToken'] = accessToken;
                    controller.response.data['refreshToken'] = refreshToken;
                }
            }
            else {
                controller.makeError('email', 'Credentials are not valid');
                controller.makeError('password', 'Credentials are not valid');
            }
        }
        catch (err) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
