import dressesController from "../controllers/dresses.controller";
import { Router } from "express";
import { upload } from "../middlewares/upload";

const router = Router();

router.post('/create', upload.single('picture'),dressesController.createDress);
router.get('/', dressesController.getDresses);
router.get('/:id', dressesController.getDressById);
router.get('/name/:name', dressesController.getDressByName);
router.put('/:name', dressesController.updateDressByName);
router.delete('/:name', dressesController.deleteDress);

export default router;