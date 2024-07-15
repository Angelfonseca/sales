import { Document } from "mongoose";

export interface jewerly extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
}

