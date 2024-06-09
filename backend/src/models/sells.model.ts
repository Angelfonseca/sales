import { Schema, model } from 'mongoose';
import { Sell } from '../interfaces/sells.interface';

const sellSchema = new Schema<Sell>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    loanDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    available: { type: Boolean, required: true },
    folio: { type: Number, required: true }
});

const SellModel = model<Sell>('Sell', sellSchema);
export default SellModel;
