import sellsModel from '../models/sells.model';
import {Sell} from '../interfaces/sells.interface';
import usersService from './users.service';

const createSell = async (sell: Sell, id: string) => {
    const response = await sellsModel.create(sell);
    if (response && response._id) {
        await usersService.addSell(id, response._id.toString());
    }
};

const getSells = async () => {
    return sellsModel.find();
};

const getSellById = async (id: string) => {
    return sellsModel.findById(id);
};

const updateSell = async (id: string, sellData: Sell) => {
    return sellsModel.findByIdAndUpdate(id, sellData, {new: true});
};

const deleteSell = async (id: string) => {
    return sellsModel.findByIdAndDelete(id);
};

const getSellsByUser = async (id: string) => {
    return sellsModel.find({user: id});
}

const getReturnedSells = async () => {
    return sellsModel.find({available: true});
}

const getLoanedSells = async () => {
    return sellsModel.find({available: false});
}

const getAvailableSells = async (init: Date, end: Date) => {
    if (init && end) {
        return sellsModel.find({returnDate: {$gte: init, $lte: end}});
    }
};
export default { createSell, getSells, getSellById, updateSell, deleteSell, getSellsByUser, getReturnedSells, getLoanedSells, getAvailableSells};