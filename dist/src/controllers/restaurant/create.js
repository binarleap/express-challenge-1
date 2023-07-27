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
export const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const { name, address, cuisineType, latitude, longitude } = req.body;
    // filter required values
    controller.filterEmpty(['name', 'address', 'cuisineType', 'latitude', 'longitude']);
    if (controller.canProceed()) {
        // check dummy coordinates
        if (!controller.isDummyCoordinate(latitude, longitude)) {
            controller.makeError('latitude', 'LatLon is not valid');
            controller.makeError('longitude', 'LatLon is not valid');
        }
    }
    if (controller.canProceed()) {
        // create restaurant
        const restaurant = new Restaurant({
            name,
            address,
            cuisineType,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        try {
            const savedRestaurant = yield restaurant.save();
            controller.response.message = "Restaurant created successfully";
            controller.response.data['restaurant'] = savedRestaurant;
        }
        catch (e) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
