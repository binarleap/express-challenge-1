import {User} from '../../models/user.js';
import Controller from '../controller.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import {TypedRequest} from "../controller.type";
import {LoginBody} from "./types/login";
import {Response} from 'express'

export const login = async (req: TypedRequest<LoginBody>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        email,
        password
    } = req.body;

    // filter required values
    controller.filterEmpty(['email', 'password'])

    if (controller.canProceed()) {
        // validate email address
        if (!controller.isEmailAddress(email)) {
            controller.makeError('email', 'Email address is not valid')
        }
    }

    if(controller.canProceed()) {
        try {
            // check user
            const user = await User.findOne({
                email
            })

            // user is valid
            if (user) {
                // compare password
                if(await bcrypt.compare(password, user.password)) {
                    // generate access token and set in cookie
                    let accessToken = jwt.sign({id: user.id}, process.env.AUTH_SECRET ?? '', {expiresIn: '1h'});
                    controller.setCookie("accessToken", accessToken, {
                        secure: false,
                        httpOnly: true,
                        expires: dayjs().add(60, "minutes").toDate()
                    });

                    // generate refresh token and set in cookie
                    const refreshToken = jwt.sign({ id: user.id }, process.env.AUTH_SECRET ?? '', { expiresIn: '1d' });
                    controller.setCookie("refreshToken", refreshToken, {
                        secure: false,
                        httpOnly: true,
                        expires: dayjs().add(1, "day").toDate()
                    });

                    controller.response.message = 'Logged in successfully'

                    controller.response.data['user'] = user
                    controller.response.data['accessToken'] = accessToken
                    controller.response.data['refreshToken'] = refreshToken
                }
            } else {
                controller.makeError('email', 'Credentials are not valid')
                controller.makeError('password', 'Credentials are not valid')
            }
        } catch (err) {
            controller.makeServerError();
        }
    }

    return controller.makeResponse()
}
