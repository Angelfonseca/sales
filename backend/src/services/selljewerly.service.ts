import { selljewerly } from "../interfaces/selljewerly.interface";
import selljewerlyModel from "../models/selljewerly.model";
import jewerlyService from "./jewerly.service";

const createSellJewerly = async (sellJewerlyData: selljewerly) => {
    try {
        const stock = sellJewerlyData.quantity;
        const id = sellJewerlyData.jewerly.toString();
        const changeStock = await jewerlyService.updateSoldJewerly(id, stock);
        if (!changeStock) {
            throw new Error('Jewerly not found');
        }
        const response = await selljewerlyModel.create(sellJewerlyData);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

const getSellJewerlies = async () => {
    return selljewerlyModel.find();
}

const getSellJewerlyById = async (id: string) => {
    return selljewerlyModel.findById(id);
}

const updateSellJewerly = async (id: string, sellJewerlyData: selljewerly) => {
    return selljewerlyModel.findByIdAndUpdate(id, sellJewerlyData, { new: true });
}

const deleteSellJewerly = async (id: string) => {
    return selljewerlyModel.findByIdAndDelete(id);
}

const getSellJewerlyByMonth = async (month: Date) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1); // Primer día del mes siguiente
    try {
        const jewsells = await selljewerlyModel.find({ sellDate: { $gte: startOfMonth, $lt: endOfMonth } });
        let totalSalesAmount = 0;
        for (const sell of jewsells) {
            totalSalesAmount += sell.price * sell.quantity;
        }
        return {totalSalesAmount, jewsells};
    } catch (error: any) {
        throw new Error(error.message);
    }
}



export default {
    createSellJewerly,
    getSellJewerlies,
    getSellJewerlyById,
    updateSellJewerly,
    deleteSellJewerly,
    getSellJewerlyByMonth
}
