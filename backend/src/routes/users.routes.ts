import UsersController from '../controllers/users.controller';
import router from 'express';

const routes = router();

routes.get('/', UsersController.getUsers);
routes.get('/:id', UsersController.getUserById);
routes.post('/', UsersController.createUser);
routes.put('/:id', UsersController.updateUser);
routes.delete('/:id', UsersController.deleteUser);
routes.put('/:id/sells', UsersController.addSell);
routes.post('/auth/login', UsersController.login);
routes.get('/username/:username', UsersController.getUserByUsername);

export default routes;