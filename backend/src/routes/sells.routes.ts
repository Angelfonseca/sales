import sellsController from "../controllers/sells.controller";
import router from "express";

const routes = router();

routes.get('/', sellsController.getSells);
routes.get('/:id', sellsController.getSellById);
routes.post('/:id', sellsController.createSell);
routes.put('/:id', sellsController.updateSell);
routes.delete('/:id', sellsController.deleteSell);
routes.get('/user/:id', sellsController.getSellsByUser);
routes.get('/returned', sellsController.getReturnedSells);
routes.get('/loaned', sellsController.getLoanedSells);
routes.get('/available', sellsController.getAvailableSells);


export default routes;