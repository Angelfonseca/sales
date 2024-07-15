import sellsController from "../controllers/sells.controller";
import router from "express";
import ensureAuth from "../middlewares/auth.middleware";

const routes = router();

routes.get('/', ensureAuth,sellsController.getSells);
routes.get('/:id', ensureAuth,sellsController.getSellById);
routes.post('/', ensureAuth,sellsController.createSell);
routes.put('/:id', ensureAuth,sellsController.updateSell);
routes.delete('/:id', ensureAuth,sellsController.deleteSell);
routes.get('/user/:id', ensureAuth,sellsController.getSellsByUser);
routes.get('/returned', ensureAuth,sellsController.getReturnedSells);
routes.get('/loaned', ensureAuth,sellsController.getLoanedSells);
routes.get('/available', ensureAuth,sellsController.getAvailableSells);
routes.put('/return/:id', ensureAuth,sellsController.recieveDress);
routes.post('/filter', ensureAuth,sellsController.getSellsbyDate);
routes.get('/actual/:id', sellsController.getActualDress);
routes.post('/month', sellsController.getSellsByMonth);

export default routes;