import UsersController from '../controllers/users.controller';
import router from 'express';
import ensureAuth from '../middlewares/auth.middleware';

const routes = router();

routes.get('/', ensureAuth,UsersController.getUsers);
routes.get('/:id', ensureAuth,UsersController.getUserById);
routes.post('/', ensureAuth,UsersController.createUser);
routes.put('/:id', ensureAuth,UsersController.updateUser);
routes.delete('/:id', ensureAuth,UsersController.deleteUser);
routes.put('/:id/sells', ensureAuth,UsersController.addSell);
routes.post('/auth/login', UsersController.login);
routes.get('/username/:username', ensureAuth,UsersController.getUserByUsername);

export default routes;