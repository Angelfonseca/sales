import { Schema, model } from 'mongoose';
import { Blacklist } from '../interfaces/blacklist.interface';

const blacklistSchema = new Schema<Blacklist>({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const BlacklistModel = model<Blacklist>('Blacklist', blacklistSchema);
export default BlacklistModel;