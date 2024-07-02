import sellsModel from '../models/sells.model';
import {Sell} from '../interfaces/sells.interface';
import usersService from './users.service';

const createSell = async (sell: Sell, id: string) => {
    try {

        const existingSell = await sellsModel.findOne({ folio: sell.folio });

        if (existingSell) {
            throw new Error('El folio ya está en uso.');
        }

        // Obtener el total de documentos en la colección de ventas
        const totalSells = await sellsModel.countDocuments();

        // Incrementar el total en 1 para obtener el nuevo valor del folio
        const newFolio = totalSells + 1;

        // Asignar el nuevo folio al objeto de venta
        sell.folio = newFolio;

        // Crear el nuevo documento de venta
        const response = await sellsModel.create(sell);

        if (response && response._id) {
            // Aquí puedes realizar otras operaciones después de crear el documento de venta
        }

        // Retornar el nuevo documento de venta creado
        return response;
    } catch (error: any) {
        // Manejar cualquier error que pueda ocurrir durante el proceso
        throw new Error(error.message);
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

const returnSell = async (id: string) => {
    const date = new Date();
    return sellsModel.findByIdAndUpdate(id, {available: true, returnDate: date}, {new: true});
}

const getAvailableSells = async (init: Date, end: Date) => {
    const inicio = init;
    const fin = end;
    return sellsModel.find({loanDate: {$gte: inicio, $lte: fin}});
}   
export default { createSell, getAvailableSells, getSells, getSellById, updateSell, deleteSell, getSellsByUser, getReturnedSells, getLoanedSells, returnSell};