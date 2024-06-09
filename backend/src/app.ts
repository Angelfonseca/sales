import express from 'express';
import dbConnect from './config/db';
import cors from 'cors';
import usersRoutes from './routes/users.routes';
import sellsRoutes from './routes/sells.routes';
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/users', usersRoutes);
app.use('/api/sells', sellsRoutes);




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