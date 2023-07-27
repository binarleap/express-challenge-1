import {generatePassword, hashPassword} from "../../utils/password.js";
import {UserOtp} from '../../models/user-otp.js';
import {User} from '../../models/user.js';
import Controller from '../controller.js';
import dayjs from "dayjs";
import {TypedRequest} from "../controller.type";
import {ForgotPasswordBody} from "./types/forgot-password";
import {Response} from "express";

export const forgotPassword = async (req: TypedRequest<ForgotPasswordBody>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        email
    } = req.body;

    // filter required values
    controller.filterEmpty(['email'])

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

            // user found
            if(user) {
                // make an otp
                const code = btoa(hashPassword(generatePassword({})));

                // insert otp
                const userOtp = new UserOtp({
                    code,
                    expiresAt: dayjs().add(1, 'hour'),
                    user
                })

                const userOtpSave = await userOtp.save()

                if(userOtpSave) {
                    // send email will be here
                }
            }

            controller.response.message = 'If email address is correct, An email containing the reset code is sent to your inbox'
        } catch (err) {
            controller.makeServerError();
        }
    }

    return controller.makeResponse()
}
