import dressService from '../services/dresses.service';
import { Dress } from '../interfaces/dresses.interface';
import { Request, Response } from 'express';
import { handleHttp } from '../utils/error.handle';
import path from 'path';

const createDress = async (req: Request, res: Response): Promise<Response> => {
    try {
        const dressData = { ...req.body };

        if (req.file && req.file.filename) {
            dressData.picture = path.join(req.file.filename);
        }

        const createdDress = await dressService.createDress(dressData);
        return res.status(201).json(createdDress);
    } catch (error: any) {
        console.error('Error creating dress:', error);
        handleHttp(res, 500, 'Error creating dress');
        return res.status(500).json({ message: 'Error creating dress' });
    }
};

const getDresses = async (req: Request, res: Response) => {
    try {
        const dresses = await dressService.getDresses();
        res.status(200).json({ data: dresses });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getDressById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const dress = await dressService.getDressById(id);
        res.status(200).json({  dress });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getDressByName = async (req: Request, res: Response) => {
    try {
        const name: string = req.params.name;
        const dress = await dressService.getDressByName(name);
        res.status(200).json({ data: dress });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const updateDressByName = async (req: Request, res: Response) => {
    try {
        const name: string = req.params.name;
        const dressData: Dress = req.body;
        const updatedDress = await dressService.updateDressByName(name, dressData);
        res.status(200).json({ data: updatedDress, message: 'Dress updated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDress = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.params;

        const deletedDress = await dressService.deleteDress(name);

        if (deletedDress) {
            return res.status(200).json({ message: 'Dress deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Dress not found' });
        }
    } catch (error: any) {
        console.error('Error deleting dress:', error);
        handleHttp(res, 500, 'Error deleting dress');
        return res.status(500).json({ message: 'Error deleting dress' });
    }
};

const getDressesByCategory = async (req: Request, res: Response) => {
    try {
        const category: string = req.params.category;
        const dresses = await dressService.getDressesByCategory(category);
        res.status(200).json({ data: dresses });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
const changeDressAvailability = async (req: Request, res: Response) => {
    try {
        const name: string = req.params.name;
        const available: boolean = req.body.available;
        const updatedDress = await dressService.changeDressAvailability(name, available);
        res.status(200).json({ data: updatedDress, message: 'Dress availability updated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
const changeCleaning = async (req: Request, res: Response) => {
    try {
        const name: string = req.params.name;
        const cleaning: boolean = req.body.cleaning;
        const updatedDress = await dressService.changeCleaning(name, cleaning);
        res.status(200).json({ data: updatedDress, message: 'Dress cleaning updated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export default { createDress, getDresses, getDressById, getDressByName, updateDressByName, deleteDress, getDressesByCategory, changeDressAvailability, changeCleaning };
