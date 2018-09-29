import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import indexRoute from './routes/index';
import config from './config/database';


dotenv.load();

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`)
})

mongoose.connection.on('error', (err) => {
    console.log(`Database error ${err}`)
})


// Set up the express app
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


indexRoute(app);

const port = parseInt(process.env.PORT, 10) || 3000;


app.listen(port, () => {
  console.log(`We are live on ${port}`);
});

export default app;