import selljewerlyService from '../services/selljewerly.service';
import { Request, Response } from 'express';

const createSellJewerly = async (req: Request, res: Response) => {
    try {
        const response = await selljewerlyService.createSellJewerly(req.body);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getSellJewerlies = async (req: Request, res: Response) => {
    try {
        const response = await selljewerlyService.getSellJewerlies();
        res.status(200).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getSellJewerlyById = async (req: Request, res: Response) => {
    try {
        const response = await selljewerlyService.getSellJewerlyById(req.params.id);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const updateSellJewerly = async (req: Request, res: Response) => {
    try {
        const response = await selljewerlyService.updateSellJewerly(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const deleteSellJewerly = async (req: Request, res: Response) => {
    try {
        const response = await selljewerlyService.deleteSellJewerly(req.params.id);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}



export default {
    createSellJewerly,
    getSellJewerlies,
    getSellJewerlyById,
    updateSellJewerly,
    deleteSellJewerly,

}