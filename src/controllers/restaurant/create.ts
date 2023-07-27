import Controller from '../controller.js';
import {Response} from "express";
import {TypedRequest} from "../controller.type";
import {CreateRestaurantBody} from "./types/create";
import {Restaurant} from "../../models/restaurant.js";

export const createRestaurant = async (req: TypedRequest<CreateRestaurantBody>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        name,
        address,
        cuisineType,
        latitude,
        longitude
    } = req.body;

    // filter required values
    controller.filterEmpty(['name', 'address', 'cuisineType', 'latitude', 'longitude'])

    if (controller.canProceed()) {
        // check dummy coordinates
        if (!controller.isDummyCoordinate(latitude, longitude)) {
            controller.makeError('latitude', 'LatLon is not valid')
            controller.makeError('longitude', 'LatLon is not valid')
        }
    }

    if(controller.canProceed()) {
        // create restaurant
        const restaurant = new Restaurant({
            name,
            address,
            cuisineType,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        })

        try {
            const savedRestaurant = await restaurant.save();

            controller.response.message = "Restaurant created successfully"
            controller.response.data['restaurant'] = savedRestaurant;
        } catch (e) {
            controller.makeServerError()
        }
    }

    return controller.makeResponse()
}
