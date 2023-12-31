import Controller from '../controller.js';
import {Request, Response} from "express";
import {Restaurant} from "../../models/restaurant.js";

export const deleteRestaurant = async (req: Request<{ id: string }>, res: Response) => {
    const controller = new Controller(req, res);

    const {
        id
    } = req.params;

    try {
        // get restaurant
        const restaurant = await Restaurant.findById(id)

        if (restaurant) {
            const removeRestaurant = await Restaurant.findByIdAndRemove(id)

            if  (removeRestaurant) {
                controller.response.message = "Restaurant deleted"
            } else {
                controller.makeServerError()
            }
        } else {
            controller.makeError('id', 'Restaurant id does not exist')
        }
    } catch (e) {
        controller.makeServerError()
    }

    return controller.makeResponse()
}
