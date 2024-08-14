import selljewerlyController from "../controllers/selljewerly.controller";
import router from "express";

const routes = router();

routes.get('/', selljewerlyController.getSellJewerlies);
routes.get('/:id', selljewerlyController.getSellJewerlyById);
routes.post('/', selljewerlyController.createSellJewerly);
routes.put('/:id', selljewerlyController.updateSellJewerly);
routes.delete('/:id', selljewerlyController.deleteSellJewerly);
routes.post('/month', selljewerlyController.getSellJewerlyByMonth);

export default routes;