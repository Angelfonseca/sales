import { Schema, model } from 'mongoose';
import { Dress } from '../interfaces/dresses.interface';

const dressSchema = new Schema<Dress>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    picture: { type: String, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, required: true },
    cleaning: { type: Boolean, required: true, default: false},
});

const DressModel = model<Dress>('Dress', dressSchema);

export default DressModel;
