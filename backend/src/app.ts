import express from 'express';
import dbConnect from './config/db';
import cors from 'cors';
import usersRoutes from './routes/users.routes';
import sellsRoutes from './routes/sells.routes';
import dressesRoutes from './routes/dresses.routes';
import blackRoutes from './routes/blacklist.routes';
import jewelryRoutes from './routes/jewerly.routes';
import selljewerlyRoutes from './routes/selljewerly.routes';  
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/users', usersRoutes);
app.use('/api/sells', sellsRoutes);
app.use('/api/dresses', dressesRoutes);
app.use('/api/blacklist', blackRoutes);
app.use('/api/jewerly', jewelryRoutes);
app.use('/api/selljewerly', selljewerlyRoutes);




const start = async () => {
  try {
    console.log('Starting server...');
    await app.listen(port);
    console.log(`Server listening on ${port}`);
    await dbConnect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Error starting server: ', error);
  }
}

start();