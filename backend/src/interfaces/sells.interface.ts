import { Document } from 'mongoose';
import { User } from './users.interface';
import { Dress } from './dresses.interface';
import { Types } from 'mongoose';

export interface Sell extends Document {
    user: Types.ObjectId | User;
    dress: Dress;
    recipient: string;
    loanDate: Date;
    returnDate: Date;
    returned: boolean;
    phone: number;
    address: string;
    receivedfor: User;
}
