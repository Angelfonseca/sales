import jewerlyModel from "../models/jewerly.model";
import { jewerly } from "../interfaces/jewerly.interface";

const createJewerly = async (jewerlyData: jewerly) => {
    try {
        const response = await jewerlyModel.create(jewerlyData);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getJewerly = async () => {
    return jewerlyModel.find();
};

const getJewerlyById = async (id: string) => {
    return jewerlyModel.findById(id);
};

const updateJewerly = async (id: string, jewerlyData: jewerly) => {
    return jewerlyModel.findByIdAndUpdate(id, jewerlyData, { new: true });
}

const deleteJewerly = async (id: string) => {
    return jewerlyModel.findByIdAndDelete(id);
}

const getJewerlyByCategory = async (category: string) => {
    return jewerlyModel.find({ category: category, stock: { $gte: 1 } });
}

const getJewerlyonStock = async () => {
    return jewerlyModel.find({ stock: { $gte: 1 } });
}

const sellJewerly = async (id: string, sellDate: Date) => {
    try {
        const jewerly = await getJewerlyById(id);
        if (!jewerly) {
            throw new Error('Jewerly not found');
        }
        const date = sellDate;
        jewerly.stock = jewerly.stock - 1;
        return jewerlyModel.findByIdAndUpdate(id, jewerly, { new: true });
    } catch (error: any) {
        throw new Error(error.message);
    }
}

const updateSoldJewerly = async (id: string, stock: number) => {
    try {
        const soldJewelies = stock;
        const jewerly = await getJewerlyById(id);
        if (!jewerly) {
            throw new Error('Jewerly not found');
        }
        jewerly.stock = jewerly.stock - soldJewelies;
        return jewerlyModel.findByIdAndUpdate(id, jewerly, { new: true });
    }
    catch (error: any) {
        throw new Error(error.message);
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
    updateSoldJewerly
};