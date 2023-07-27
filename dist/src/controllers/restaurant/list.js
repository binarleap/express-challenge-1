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
export const listRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const restaurants = yield Restaurant.find();
    try {
        controller.response.message = "List of restaurants";
        controller.response.data['restaurants'] = restaurants;
    }
    catch (e) {
        controller.makeServerError();
    }
    return controller.makeResponse();
});
