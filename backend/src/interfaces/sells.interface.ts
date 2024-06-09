import { Document } from 'mongoose';
import { User } from './users.interface';

export interface Sell extends Document {
    user: User;
    name: string;
    folio: number;
    price: number;
    description: string;
    loanDate: Date;
    returnDate: Date;
    available: boolean;
}
