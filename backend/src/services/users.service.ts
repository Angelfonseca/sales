import userModel from '../models/users.model';
import {User} from '../interfaces/users.interface';

const createUser = async (user: User) => {
    return userModel.create(user);
    };

const getUsers = async () => {
    return userModel.find();
};

const getUserById = async (id: string) => {
    return userModel.findById(id);
};

const updateUser = async (id: string, userData: User) => {
    return userModel.findByIdAndUpdate(id, userData, {new: true});
}

const deleteUser = async (id: string) => {
    return userModel.findByIdAndDelete(id);
}

const addSell = async (id: string, sellId: string) => {
    return userModel.findByIdAndUpdate(id, {$push: {sells: sellId}});
}

export default { createUser, getUsers, getUserById, updateUser, deleteUser, addSell };