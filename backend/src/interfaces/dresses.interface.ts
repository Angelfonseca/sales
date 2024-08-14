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
    cleaning: boolean;
    sold: boolean;
    forSelling: boolean;
}

export type DressDocument = Dress & Document;