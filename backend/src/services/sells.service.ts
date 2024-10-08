import sellsModel from '../models/sells.model';
import {Sell} from '../interfaces/sells.interface';
import usersService from './users.service';
import dressModel from '../models/dresses.model';
import dressesService from './dresses.service';
import mongoose from 'mongoose';
import userModel from '../models/users.model';
import { error } from 'console';
import { get } from 'http';

const createSell = async (sellData: Sell) => {
    try {
        const dress = await dressModel.findById(sellData.dress);
        if (!dress) {
            throw new Error('Dress not found');
        }
        if (!dress.available) {
            throw new Error('Dress not available');
        }
        const dressResult = await dressesService.getDressByName(dress.name);
        const dressid = dressResult?._id;
        await dressesService.changeDressAvailability(dress.name, false);
        const response = await sellsModel.create(sellData);
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

const recieveDress = async (id: string, userid: string) => {
  try {
    const sell = await sellsModel.findById(id);
    if (!sell) {
      throw new Error('Sell not found');
    }
    const user = await usersService.getUserByUsername(userid);
    if (!user) {
      throw new Error('User not found');
    }
    const dress = await dressModel.findById(sell.dress);
    if (!dress) {
      throw new Error('Dress not found');
    }
    if (sell.returned) {
      throw new Error(' El vestido ya ha sido devuelto');
    }
    const dressResult = await dressesService.getDressByName(dress.name);
    const dressid = dressResult?._id;
    await dressesService.changeDressAvailability(dress.name, true);
    const response = await sellsModel.findByIdAndUpdate(id, { returned: true, receivedfor: user._id }, { new: true });
    if (!response) {
      throw new Error('Error updating sell');
    }
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};
const getSellByDress = async (dressid: string) => {
  return sellsModel.findOne({dress: dressid});
}

const getActualDress = async ( dressid: string) => {
  const dress= await dressModel.findById(dressid);
  if (!dress) {
    throw new Error('Dress not found');
  }
  console.log(dress);
  const sell = await getSellByDress(dressid);
  if (!sell) {
    throw new Error('Sell not found');
  }
  if (sell.returned) {
  return sell;
  }
  if (!sell.returned) {
    return sell;
  }
}

const filterSellsbyDate = async (init: Date, end: Date) => {
    const inicio = init;
    const fin = end;
    return sellsModel.find({createdAt: {$gte: inicio, $lte: fin}});
}

const getTotalSellsByMonth = async (month: Date) => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

  try {
    const sells = await sellsModel.find({ loanDate: { $gte: startOfMonth, $lt: endOfMonth } })
      .populate('dress');

    let totalSalesAmount = 0;
    for (const sell of sells) {
      const dress = sell.dress;
      if (dress) {
        totalSalesAmount += dress.price;
      }
    }

    return {totalSalesAmount, sells};
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw new Error('Error fetching sales');
  }
};


export default { createSell, getAvailableSells, getSells, getSellById, updateSell, deleteSell, getSellsByUser, getReturnedSells, getLoanedSells, returnSell, recieveDress, getActualDress , filterSellsbyDate, getTotalSellsByMonth};