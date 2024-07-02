import { Document } from 'mongoose';

export interface Dress {
    name: string;
    description: string;
    size: string;
    color: string;
    price: number;
    picture: string;
    category: string;
    available: boolean;
}

export type DressDocument = Dress & Document;