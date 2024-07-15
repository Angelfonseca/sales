import { Document } from "mongoose";
import { jewerly } from "./jewerly.interface";

export interface selljewerly extends Document {
    jewerly: jewerly;
    sellDate: Date;
    price: number;
    quantity: number;
}