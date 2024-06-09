
import { Document } from 'mongoose';
export interface User extends Document{
    name: string;
    username: number;
    email: string;
    password: string;
    sells: [];
    }