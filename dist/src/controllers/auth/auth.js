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
export const auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    if (controller.canProceed()) {
        try {
            // check user
            const user = yield User.findById(req.user);
            // user is valid
            if (user) {
                controller.response.message = 'Authenticated successfully';
                controller.response.data['user'] = user;
            }
            else {
                controller.makeUnauthorizedError();
            }
        }
        catch (err) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
