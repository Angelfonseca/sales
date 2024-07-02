import sellsService from "../services/sells.service";
import { Request, Response } from 'express';
import { Sell } from '../interfaces/sells.interface';
import { handleHttp } from "../utils/error.handle";

const createSell = async (req: Request, res: Response) => {
    try {
        const sellData: Sell = req.body;
        const userId = req.params.id;
        await sellsService.createSell(sellData, userId);
        res.status(201).json({ message: 'Sell created' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getSells = async (req: Request, res: Response) => {
    try {
        const sells = await sellsService.getSells();
        res.status(200).json({ data: sells });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getSellById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const sell = await sellsService.getSellById(id);
        res.status(200).json({ data: sell });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const updateSell = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const sellData: Sell = req.body;
        const updatedSell = await sellsService.updateSell(id, sellData);
        res.status(200).json({ data: updatedSell, message: 'Sell updated' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const deleteSell = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        await sellsService.deleteSell(id);
        res.status(200).json({ message: 'Sell deleted' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getSellsByUser = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;
        const sells = await sellsService.getSellsByUser(userId);
        res.status(200).json({ data: sells });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getReturnedSells = async (req: Request, res: Response) => {
    try {
        const sells = await sellsService.getReturnedSells();
        res.status(200).json({ data: sells });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getLoanedSells = async (req: Request, res: Response) => {
    try {
        const sells = await sellsService.getLoanedSells();
        res.status(200).json({ data: sells });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getAvailableSells = async (req: Request, res: Response) => {
    try {
        const init: Date = req.body.init;
        const end: Date = req.body.end;
        const sells = await sellsService.getAvailableSells(init, end);
        res.status(200).json({ data: sells });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const returnSell = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        await sellsService.returnSell(id);
        res.status(200).json({ message: 'Sell returned' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

export default { createSell, getSells, getSellById, updateSell, deleteSell, getSellsByUser, getReturnedSells, getLoanedSells, getAvailableSells, returnSell };