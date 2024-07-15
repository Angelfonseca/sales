import { Document } from "mongoose";

export interface Blacklist {
    name: string;
    description: string;
}

export type BlacklistDocument = Blacklist & Document;