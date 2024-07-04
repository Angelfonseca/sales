import userServices from '../services/users.service';
import { Request, Response } from 'express';
import { User } from '../interfaces/users.interface';
import { handleHttp } from '../utils/error.handle';
import jwtService from '../utils/jwt.utils';

const createUser = async (req: Request, res: Response) => {
    try {
        const userData: User = req.body;
        const newUser = await userServices.createUser(userData);
        res.status(201).json({ data: newUser, message: 'User created' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userServices.getUsers();
        return users;
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
};
const login = async (req: Request, res: Response) => {
    try {
        const credentials = req.body;
        const result = await userServices.login(credentials);
  
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
  
        const token = await jwtService.createToken(result.user);
        return res.status(200).json({ user: result.user, token });
  
    } catch (error) {
        console.error('Error in loginController:', error);
        return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
    }
  };

const getUserById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const user = await userServices.getUserById(id);
        res.status(200).json({ user });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const username: string = req.params.username;
        const user = await userServices.getUserByUsername(username);
        res.status(200).json({ user });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const userData: User = req.body;
        const updatedUser = await userServices.updateUser(id, userData);
        res.status(200).json({ data: updatedUser, message: 'User updated' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        await userServices.deleteUser(id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);
    }
};

const addSell = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const sellId: string = req.body.sellId;
        await userServices.addSell(id, sellId);
        res.status(200).json({ message: 'Sell added to user' });
    } catch (error: any) {
        handleHttp(res, 500, error.message);;
    }
};

export default { createUser, getUsers, getUserById, updateUser, deleteUser, addSell, login, getUserByUsername }