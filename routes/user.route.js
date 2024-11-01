import express from 'express'; // Импортируем express
import { verifyToken } from '../lib/middleware.js'; // Импортируем middleware для проверки токена
import { 
  // test, // Закомментированный импорт
  getUser, // Получение пользователя по id
  updateUser, // Обновление пользователя
  deleteUser, // Удаление пользователя
} from '../controllers/user.controller.js'; // Импортируем контроллеры

const router = express.Router(); // Создаем роутер

router.get('/:id', verifyToken, getUser); // Получение пользователя с проверкой токена
router.patch('/update/:id', verifyToken, updateUser); // Обновление пользователя с проверкой токена
router.delete('/delete/:id', verifyToken, deleteUser); // Удаление пользователя с проверкой токена

export default router; // Экспортируем роутер
