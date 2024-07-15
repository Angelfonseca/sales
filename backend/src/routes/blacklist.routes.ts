import blacklistController from "../controllers/blacklist.controller";
import router from 'express';
import ensureAuth from '../middlewares/auth.middleware';

const routes = router();

routes.get('/',  blacklistController.getBlacklists);
routes.get('/:name', ensureAuth, blacklistController.getBlacklistByName);
routes.post('/', ensureAuth, blacklistController.createBlacklist);
routes.put('/:name', ensureAuth, blacklistController.updateBlacklistByName);
routes.delete('/name/:name', ensureAuth, blacklistController.deleteBlacklist);
routes.delete('/:id', ensureAuth, blacklistController.deleteBlacklistbyid);

export default routes;