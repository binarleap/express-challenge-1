var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generatePassword, hashPassword } from "../../utils/password.js";
import { UserOtp } from '../../models/user-otp.js';
import { User } from '../../models/user.js';
import Controller from '../controller.js';
import dayjs from "dayjs";
export const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const { email } = req.body;
    // filter required values
    controller.filterEmpty(['email']);
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
            // user found
            if (user) {
                // make an otp
                const code = btoa(hashPassword(generatePassword({})));
                // insert otp
                const userOtp = new UserOtp({
                    code,
                    expiresAt: dayjs().add(1, 'hour'),
                    user
                });
                const userOtpSave = yield userOtp.save();
                if (userOtpSave) {
                    // send email will be here
                }
            }
            controller.response.message = 'If email address is correct, An email containing the reset code is sent to your inbox';
        }
        catch (err) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
