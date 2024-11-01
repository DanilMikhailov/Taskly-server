import express from 'express';
import 'dotenv/config'; // Загрузка переменных из .env
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import { errorHandler } from './lib/middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cldRouter from './routes/cloudinary.route.js'; 
import taskRouter from './routes/task.route.js'; 

const app = express();
const PORT = process.env.PORT || 3000; 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(fileUpload()); 

app.use(cors({ 
    origin: process.env.CLIENT_URL, 
    credentials: true, 
    }) 
    );

// Middleware для обработки JSON и cookies
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/image', cldRouter);
app.use('/api/v1/tasks', taskRouter);

// Обработчик ошибок
app.use(errorHandler);

app.get('/', (req, res) => { 
    res.status(200).json({ message: 'Welcome to Taskly API'}); 
}); 

// Обработчик для всех несуществующих маршрутов
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Сервер слушает на порту ${PORT}`); 
}); 

