
import { Document } from 'mongoose';
import { Sell } from './sells.interface';
export interface User extends Document{
    name: string;
    username: string;
    password: string;
    sells: [Sell];
    role: string;
    }