import path from "path";
import jewerlyService from "../services/jewerly.service";
import { Request, Response } from 'express';

const createJewerly = async (req: Request, res: Response) => {
    try {
        const jewerlyData = {...req.body};
        if(req.file && req.file.filename){
            jewerlyData.image = path.join(req.file.filename);
        }
        const jewerly = await jewerlyService.createJewerly(jewerlyData);
        res.status(201).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const getJewerly = async (req: Request, res: Response) => {
    try {
        const jewerly = await jewerlyService.getJewerly();
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const getJewerlyById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const jewerly = await jewerlyService.getJewerlyById(id);
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const updateJewerly = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const jewerlyData = req.body;
        const jewerly = await jewerlyService.updateJewerly(id, jewerlyData);
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const deleteJewerly = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const jewerly = await jewerlyService.deleteJewerly(id);
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const getJewerlyByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;
        const jewerly = await jewerlyService.getJewerlyByCategory(category);
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const getJewerlyonStock = async (req: Request, res: Response) => {
    try {
        const jewerly = await jewerlyService.getJewerlyonStock();
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}

const sellJewerly = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const sellDate = req.body.sellDate;
        const jewerly = await jewerlyService.sellJewerly(id, sellDate);
        res.status(200).json(jewerly);
    }catch(error: any){
        res.status(400).json({ message: error.message });
    }
}



export default {
    createJewerly,
    getJewerly,
    getJewerlyById,
    updateJewerly,
    deleteJewerly,
    getJewerlyByCategory,
    getJewerlyonStock,
    sellJewerly,
};