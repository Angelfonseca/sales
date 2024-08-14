import dressesController from "../controllers/dresses.controller";
import { Router } from "express";
import { upload } from "../middlewares/upload";
import  ensureAuth  from "../middlewares/auth.middleware";

const router = Router();

router.post('/create', ensureAuth,upload.single('picture'),dressesController.createDress);
router.get('/', dressesController.getDresses);
router.get('/:id', dressesController.getDressById);
router.get('/name/:name', dressesController.getDressByName);
router.put('/:name', ensureAuth,dressesController.updateDressByName);
router.delete('/:name', ensureAuth,dressesController.deleteDress);
router.get('/category/:category', dressesController.getDressesByCategory);
router.put('/availability/:name', ensureAuth,dressesController.changeDressAvailability);
router.put('/cleaning/:name', ensureAuth,dressesController.changeCleaning);

export default router;