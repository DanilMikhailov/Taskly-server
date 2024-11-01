// Импортируем необходимые библиотеки для работы с хешированием и JWT
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/dbConnect.js';

// Получаем коллекцию пользователей из базы данных MongoDB
const collection = db.collection('users');

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body; // Извлекаем данные из тела запроса
    const query = { $or: [{ email }, { username }] }; // Ищем пользователя с таким email или именем

    const existingUser = await collection.findOne(query); // Проверяем, существует ли пользователь
    if (existingUser) {
      return next({
        status: 422, // Код ошибки: данные уже существуют
        message: 'Email или Username уже зарегистрированы.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль
    const user = {
      username,
      email,
      password: hashedPassword,
      avatar: 'https://g.codewithnathan.com/default-user.png', // Устанавливаем аватар по умолчанию
      createdAt: new Date().toISOString(), // Время создания пользователя
      updatedAt: new Date().toISOString(), // Время обновления
    };

    // Сохраняем данные нового пользователя в базе данных
    const { insertedId } = await collection.insertOne(user);

    // Генерируем JWT-токен для пользователя
    const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET);

    user._id = insertedId; // Присваиваем ID нового пользователя
    const { password: pass, updatedAt, createdAt, ...rest } = user; // Убираем конфиденциальные данные

    // Отправляем куки с токеном и данные пользователя
    res
      .cookie('taskly_token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        partitioned: true,
      })
      .status(200)
      .json(rest); // Отправляем ответ в формате JSON
  } catch (error) {
    // Обрабатываем ошибки сервера
    next({ status: 500, message: error.message || 'Ошибка регистрации' });
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await collection.findOne({ email });
    if (!validUser) {
      return next({ status: 404, message: 'User not found!' });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next({ status: 401, message: 'Wrong password!' });
    }
    const token = jwt.sign({ id: validUser._id }, process.env.AUTH_SECRET);
    const { password: pass, updatedAt, createdAt, ...rest } = validUser;
    res
      .cookie('taskly_token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        partitioned: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next({ status: 500, message: error.message || 'Ошибка входа' });
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('taskly_token');
    res.status(200).json({ message: 'Sign out successful' });
  } catch (error) {
    next({ status: 500, message: error.message || 'Ошибка выхода' });
  }
}; 
