import jewerlyController from "../controllers/jewerly.controller";
import router from "express";
import ensureAuth from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const routes = router();

routes.get('/', jewerlyController.getJewerly);
routes.get('/:id', jewerlyController.getJewerlyById);
routes.post('/', ensureAuth,upload.single('image'),jewerlyController.createJewerly);
routes.put('/:id', ensureAuth,jewerlyController.updateJewerly);
routes.delete('/:id', ensureAuth,jewerlyController.deleteJewerly);
routes.get('/category/:category', jewerlyController.getJewerlyByCategory);
routes.get('/stock', jewerlyController.getJewerlyonStock);


export default routes;