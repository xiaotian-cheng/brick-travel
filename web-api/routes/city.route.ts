import { Router, Response, Request, NextFunction } from "express";
import { CityModel, City } from "../data-model/city.model";
import { asyncMiddleware } from "../utils/utility";
import * as mongoose from 'mongoose';

export class CityRoute {
    public static create(router: Router) {
        console.log('City route create');

        //Load Cities
        router.get('/cities', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.load(req, res, next);
        }));

        //Insert City
        router.post('/cities', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.insert(req, res, next);
        }));
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await CityModel.findCities();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await CityModel.createCity(req.body);
        res.json(true);
    }
}