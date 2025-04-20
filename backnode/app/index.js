import 'dotenv/config'
import express from 'express';
import userRouter from '../routes/user_route.js'
import cors from 'cors';
import uploadRouter from '../routes/upload_route.js';
import postRouter from '../routes/post_route.js'
import likeRouter from '../routes/like_route.js'
import followRouter from '../routes/follow_route.js'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', uploadRouter); 
app.use('/api', postRouter); 
app.use('/api', likeRouter);
app.use('/api', followRouter); 

app.use('/static/books', express.static(path.join(__dirname, '../uploads/book')));
app.use('/static/profiles', express.static(path.join(__dirname, '../uploads/profile')));

app.listen(PORT, () => console.log("SERVER CONNECTED PORT " + PORT));