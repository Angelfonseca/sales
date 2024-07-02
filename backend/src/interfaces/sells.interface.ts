import { Document } from 'mongoose';
import { User } from './users.interface';
import { Dress } from './dresses.interface';

export interface Sell extends Document {
    user: User;
    dress: Dress;
    folio: number;
    recipient: string;
    loanDate: Date;
    returnDate: Date;
}
