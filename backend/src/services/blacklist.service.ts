import BlacklistModel from "../models/blacklist.model";
import { Blacklist } from "../interfaces/blacklist.interface";

const createBlacklist = async (blacklist: Blacklist): Promise<Blacklist> => {
    try {
        if (!blacklist.name) {
            throw new Error('Name is required');
        }
        const compareBlacklist = await getBlacklistByName(blacklist.name);
        if (compareBlacklist) {
            throw new Error('Blacklist already exists');
        }
        const blacklistData: Blacklist = await BlacklistModel.create(blacklist);
        return blacklistData;
    } catch (error: any) {
        throw new Error('Error creating blacklist: ' + error.message);
    }
}

const getBlacklists = async () => { 
    return BlacklistModel.find();
}

const getBlacklistById = async (id: string) => {
    return BlacklistModel.findById(id);
}

const getBlacklistByName = async (name: string) => {
    return BlacklistModel.findOne({ name });
}

const updateBlacklistByName = async (name: string, blacklistData: Blacklist) => {
    const blacklist = await getBlacklistByName(name);
    if (blacklist) {
        const blacklistId = blacklist._id;
        return BlacklistModel.findByIdAndUpdate(blacklistId, blacklistData, { new: true });
    }
    console.log("No se encontró el vestido");
    return null;
}

const deleteBlacklist = async (name: string): Promise<Blacklist | null> => {
    const blacklist = await getBlacklistByName(name);
    if (blacklist) {
        const blacklistId = blacklist._id;
        return await BlacklistModel.findByIdAndDelete(blacklistId);
    }

    console.log("No se encontró el vestido");
    return null;
};

const modifyBlacklist = async (name: string, blacklistData: Blacklist) => {
    return BlacklistModel.findOneAndUpdate({ name }, blacklistData, { new: true });
}

const deleteBlacklistbyid = async (id: string) => {
    return BlacklistModel.findByIdAndDelete(id);
}

export default { createBlacklist, getBlacklists, getBlacklistById, getBlacklistByName, updateBlacklistByName, deleteBlacklist, modifyBlacklist, deleteBlacklistbyid };