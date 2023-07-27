import {User} from '../../models/user.js';
import Controller from '../controller.js';
import {Response, Request} from 'express'

export const auth = async (req: Request, res: Response) => {
    const controller = new Controller(req, res);

    if(controller.canProceed()) {
        try {
            // check user
            const user = await User.findById(req.user)

            // user is valid
            if (user) {
                controller.response.message = 'Authenticated successfully'
                controller.response.data['user'] = user
            } else {
                controller.makeUnauthorizedError()
            }
        } catch (err) {
            controller.makeServerError();
        }
    }

    return controller.makeResponse()
}
