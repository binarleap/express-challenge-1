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
export const listNearbyRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new Controller(req, res);
    const { latLon } = req.query;
    // filter required values
    controller.filterEmptyQuery(['latLon']);
    // check dummy coordinates
    if (controller.canProceed()) {
        const splitLanLon = latLon.split(',');
        if (splitLanLon.length !== 2) {
            controller.makeError('latLon', 'LatLon is not valid');
        }
        else {
            if (!controller.isDummyCoordinate(splitLanLon[0], splitLanLon[1])) {
                controller.makeError('latLon', 'LatLon is not valid');
            }
        }
    }
    if (controller.canProceed()) {
        // split the lat and lon from query
        const splitLanLon = latLon.split(',');
        // get restaurants within w miles radius
        const restaurants = yield Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(splitLanLon[1]), parseFloat(splitLanLon[0])]
                    },
                    spherical: true,
                    maxDistance: 2 * 1609.34,
                    distanceMultiplier: 1,
                    distanceField: 'distance',
                }
            }
        ]);
        try {
            controller.response.message = "List of restaurants within 2 miles";
            controller.response.data['restaurants'] = restaurants;
        }
        catch (e) {
            controller.makeServerError();
        }
    }
    return controller.makeResponse();
});
