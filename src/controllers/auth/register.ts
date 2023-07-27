import {hashPassword} from "../../utils/password.js";
import {User} from '../../models/user.js';
import Controller from '../controller.js';
import {Response} from "express";
import {TypedRequest} from "../controller.type";
import {RegisterBody} from "./types/register";

export const register = async (req: TypedRequest<RegisterBody>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        username,
        email,
        password
    } = req.body;

    // filter required values
    controller.filterEmpty(['username', 'email', 'password'])

    if (controller.canProceed()) {
        // validate email address
        if (!controller.isEmailAddress(email)) {
            controller.makeError('email', 'Email address is not valid');
        } else {
            // check email address existence
            try {
                const checkEmail = await User.findOne({
                    email
                })

                // email address is duplicate
                if (checkEmail != null) {
                    controller.makeError('email', 'Email address is duplicate')
                }
            } catch (e) {
                controller.makeServerError()
            }
        }
    }

    if(controller.canProceed()) {
        // create user
        const user = new User({
            username,
            email,
            password: hashPassword(password)
        })

        try {
            const savedUser = await user.save();

            controller.response.message = "Registered successfully"
            controller.response.data['user'] = savedUser;
        } catch (e) {
            controller.makeServerError()
        }
    }

    return controller.makeResponse()
}
