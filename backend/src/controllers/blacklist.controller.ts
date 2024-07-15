import blacklistService from "../services/blacklist.service";
import { Request, Response } from 'express';

const createBlacklist = async (req: Request, res: Response) => {
    try {
        const blacklistData = req.body;
        const blacklist = await blacklistService.createBlacklist(blacklistData);
        res.status(201).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getBlacklists = async (req: Request, res: Response) => {
    try {
        const blacklists = await blacklistService.getBlacklists();
        res.status(200).json(blacklists);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getBlacklistById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const blacklist = await blacklistService.getBlacklistById(id);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const getBlacklistByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const blacklist = await blacklistService.getBlacklistByName(name);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const updateBlacklistByName = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const blacklistData = req.body;
        const blacklist = await blacklistService.updateBlacklistByName(name, blacklistData);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const deleteBlacklist = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const blacklist = await blacklistService.deleteBlacklist(name);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const modifyBlacklist = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const blacklistData = req.body;
        const blacklist = await blacklistService.modifyBlacklist(name, blacklistData);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

const deleteBlacklistbyid = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const blacklist = await blacklistService.deleteBlacklistbyid(id);
        res.status(200).json(blacklist);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export default { createBlacklist, getBlacklists, getBlacklistById, getBlacklistByName, updateBlacklistByName, deleteBlacklist, modifyBlacklist, deleteBlacklistbyid };
