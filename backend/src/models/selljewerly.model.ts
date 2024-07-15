import { selljewerly } from "../interfaces/selljewerly.interface";
import { Schema, model } from 'mongoose';

const selljewerlySchema = new Schema <selljewerly>({
    jewerly: { type: Schema.Types.ObjectId, ref: 'Jewerly', required: true },
    sellDate: { type: Date, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
},
{
    timestamps: true
}
);

const selljewerlyModel = model<selljewerly>('SellJewerly', selljewerlySchema);

export default selljewerlyModel;