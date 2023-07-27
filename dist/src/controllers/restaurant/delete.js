var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Controller from '../controller.js';
import { Restaurant } from "../../models/restaurant.js";
export const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const { id } = req.params;
    try {
        // get restaurant
        const restaurant = yield Restaurant.findById(id);
        if (restaurant) {
            const removeRestaurant = yield Restaurant.findByIdAndRemove(id);
            if (removeRestaurant) {
                controller.response.message = "Restaurant deleted";
            }
            else {
                controller.makeServerError();
            }
        }
        else {
            controller.makeError('id', 'Restaurant id does not exist');
        }
    }
    catch (e) {
        controller.makeServerError();
    }
    return controller.makeResponse();
});
