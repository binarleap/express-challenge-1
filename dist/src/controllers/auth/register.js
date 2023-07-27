var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { hashPassword } from "../../utils/password.js";
import { User } from '../../models/user.js';
import Controller from '../controller.js';
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const { username, email, password } = req.body;
    // filter required values
    controller.filterEmpty(['username', 'email', 'password']);
    if (controller.canProceed()) {
        // validate email address
        if (!controller.isEmailAddress(email)) {
            controller.makeError('email', 'Email address is not valid');
        }
        else {
            // check email address existence
            try {
                const checkEmail = yield User.findOne({
                    email
                });
                // email address is duplicate
                if (checkEmail != null) {
                    controller.makeError('email', 'Email address is duplicate');
                }
            }
            catch (e) {
                controller.makeServerError();
            }
        }
    }
    if (controller.canProceed()) {
        // create user
        const user = new User({
            username,
            email,
            password: hashPassword(password)
        });
        try {
            const savedUser = yield user.save();
            controller.response.message = "Registered successfully";
            controller.response.data['user'] = savedUser;
        }
        catch (e) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
