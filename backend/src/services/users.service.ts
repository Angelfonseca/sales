import userModel from '../models/users.model';
import { User } from '../interfaces/users.interface';
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const createUser = async (user: User) => {
    return userModel.create(user);
};

const getUsers = async () => {
    return userModel.find();
};

const getUserById = async (id: string) => {
    return userModel.findById(id);
};
const getUserByUsername = async (username: string) => {
    const user = await userModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  const updateUser = async (id: string, userData: Partial<User>) => {
    // Verifica si se está actualizando la contraseña
    if (userData.password) {
      // Hashea la nueva contraseña antes de guardarla
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(userData.password, salt);
      userData.password = hash;
    }
    return userModel.findByIdAndUpdate(id, userData, { new: true });
  };
const login = async (credentials: any) => {
    let user = await userModel.findOne({ username: credentials.username });
    console.log('Checking UserModel:', user);
    const isPasswordMatch = await isMatchPassword(user, credentials.password);
    console.log('Password match result:', isPasswordMatch);

    if (!isPasswordMatch) {
        return { error: true, message: 'INVALID CREDENTIALS' };
    }

    return { error: false, message: 'LOGIN SUCCESSFUL', user };
};

const isMatchPassword = async (user: any, password: string) => {
    return new Promise((resolve, reject) => {
        user.comparePassword(password, (err: any, isMatch: any) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};
const deleteUser = async (id: string) => {
    return userModel.findByIdAndDelete(id);
}

const addSell = async (id: string, sellId: string) => {
    return userModel.findByIdAndUpdate(id, { $push: { sells: sellId } });
}

export default { createUser, getUsers, getUserById, updateUser, deleteUser, addSell, login, getUserByUsername };