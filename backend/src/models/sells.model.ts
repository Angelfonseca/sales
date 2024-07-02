import { Schema, model } from 'mongoose';
import { Sell } from '../interfaces/sells.interface';

const sellSchema = new Schema<Sell>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dress: { type: Schema.Types.ObjectId, ref: 'Dress', required: true },
    loanDate: { type: Date, required: true },
    recipient: { type: String, required: true },
    returnDate: { type: Date},
    folio: { type: Number, required: true, incrementing: true},
});

const SellModel = model<Sell>('Sell', sellSchema);
export default SellModel;
