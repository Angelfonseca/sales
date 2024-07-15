import { jewerly } from "../interfaces/jewerly.interface";
import { Schema, model } from 'mongoose';

const jewerlySchema = new Schema<jewerly>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
},
{
    timestamps: true
}
);

const jewerlyModel = model<jewerly>('Jewerly', jewerlySchema);

export default jewerlyModel;