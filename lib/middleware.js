export const errorHandler = (err, req, res, next) => { 
    // Сообщение по умолчанию для ошибок, если конкретное сообщение не указано
    const defaultMessage = "We're having technical issues. Please try again later"; 
    
    // Деструктуризация полей из объекта ошибки
    const { status, message, error } = err; 

    // Если в объекте ошибки есть поле error, логируем его в консоль
    if (error) { 
        console.log(error); 
    } 

    // Возвращаем ответ клиенту с соответствующим статусом и сообщением об ошибке
    // Если сообщение не указано, используем сообщение по умолчанию
    res.status(status).json({ message: message || defaultMessage }); 
};

import jwt from 'jsonwebtoken'; 
 
export const verifyToken = (req, res, next) => { 
    const token = req.cookies.taskly_token; 
 
    if (!token) return next({ status: 401, message: 'Unauthorized' }); 
 
    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => { 
        if (err) return next({ status: 403, message: 'Forbidden' }); 
        req.user = user; 
        next(); 
    }); 
}; 
