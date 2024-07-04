import dressModel from '../models/dresses.model';
import { Dress } from '../interfaces/dresses.interface';
import { get } from 'http';
import { upload } from '../middlewares/upload';
import fs from 'fs';
import path from 'path';

const createDress = async (dress: Dress): Promise<Dress> => {
    try {
        const dressData: Dress = await dressModel.create(dress);
        return dressData;
    } catch (error: any) {
        throw new Error('Error creating dress: ' + error.message);
    }
};
const getDresses = async () => {
    return dressModel.find();
};
const getDressById = async (id: string) => {
    return dressModel.findById(id);
}
const getDressByName = async (name: string) => {
    return dressModel.findOne({ name });
}
const updateDressByName = async (name: string, dressData: Dress) => {
    const dress = await getDressByName(name);
    if (dress) {
        const dressId = dress._id;
        return dressModel.findByIdAndUpdate(dressId, dressData, { new: true });
    }
    console.log("No se encontró el vestido");
    return null;
}

const deleteDress = async (name: string): Promise<Dress | null> => {
    const dress = await getDressByName(name);
    if (dress) {
        const dressId = dress._id;

        // Delete the associated image file
        if (dress.picture) {
            const picturePath = path.join(__dirname, '../../public', dress.picture);
            fs.unlink(picturePath, (err) => {
                if (err) {
                    console.error('Error deleting the image file:', err);
                }
            });
        }

        return await dressModel.findByIdAndDelete(dressId);
    }

    console.log("No se encontró el vestido");
    return null;
};
const getDressesByCategory = async (category: string) => {
    return dressModel.find({ category });
}

const changeDressAvailability = async (name: string, available: boolean) => {
    const dress = await getDressByName(name);
    if (dress) {
        const dressId = dress._id;
        return dressModel.findByIdAndUpdate(dressId, { available }, { new: true });
    }
    console.log("No se encontró el vestido");
    return null;
}

const dressAvailability = async (name: string) => {
    const dress = await getDressByName(name);
    if (dress) {
        return dress.available;
    }
    console.log("No se encontró el vestido");
    return null;
}

const changeCleaning = async (name: string, cleaning: boolean) => {
    const dress = await getDressByName(name);
    if (!dress) {
        throw new Error(`Dress not found with name ${name}`);
    }
    const dressId = dress._id;
    const updatedDress = await dressModel.findByIdAndUpdate(
        dressId,
        { cleaning: cleaning },
        { new: true }
    );
    return updatedDress;
};


export default { createDress, getDresses, getDressById, getDressByName, updateDressByName, deleteDress, changeDressAvailability, getDressesByCategory, dressAvailability, changeCleaning };