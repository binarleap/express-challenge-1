import Controller from '../controller.js';
import {Response} from "express";
import {Restaurant} from "../../models/restaurant.js";
import {TypedRequestQuery} from "../controller.type";

export const listNearbyRestaurants = async (req: TypedRequestQuery<{ latLon: string }>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        latLon
    } = req.query

    // filter required values
    controller.filterEmptyQuery(['latLon'])

    // check dummy coordinates
    if (controller.canProceed()) {
        const splitLanLon = latLon.split(',')

        if (splitLanLon.length !== 2) {
            controller.makeError('latLon', 'LatLon is not valid')
        } else {
            if (!controller.isDummyCoordinate(splitLanLon[0], splitLanLon[1])) {
                controller.makeError('latLon', 'LatLon is not valid')
            }
        }
    }

    if(controller.canProceed()) {
        // split the lat and lon from query
        const splitLanLon = latLon.split(',')

        // get restaurants within w miles radius
        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(splitLanLon[1]), parseFloat(splitLanLon[0])]
                    },
                    spherical: true,
                    maxDistance: 2 * 1609.34, // 2 miles
                    distanceMultiplier: 1,
                    distanceField: 'distance',
                }
            }
        ]);

        try {
            controller.response.message = "List of restaurants within 2 miles"
            controller.response.data['restaurants'] = restaurants;
        } catch (e) {
            controller.makeServerError()
        }
    }

    return controller.makeResponse()
}
