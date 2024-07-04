import { Schema, model } from 'mongoose';
import { Sell } from '../interfaces/sells.interface';

const sellSchema = new Schema<Sell>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dress: { type: Schema.Types.ObjectId, ref: 'Dress', required: true },
    loanDate: { type: Date, required: true },
    recipient: { type: String, required: true },
    returnDate: { type: Date},
    returned: { type: Boolean, default: false },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    receivedfor: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null}
});

const SellModel = model<Sell>('Sell', sellSchema);
export default SellModel;
