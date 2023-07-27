import Controller from '../controller.js';
import {Request, Response} from "express";
import {Restaurant} from "../../models/restaurant.js";

export const listRestaurants = async (req: Request, res: Response) => {
    const controller = new Controller(req, res);

    const restaurants = await Restaurant.find();

    try {
        controller.response.message = "List of restaurants"
        controller.response.data['restaurants'] = restaurants;
    } catch (e) {
        controller.makeServerError()
    }

    return controller.makeResponse()
}
