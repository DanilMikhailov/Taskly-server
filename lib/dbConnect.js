import { MongoClient, ServerApiVersion } from "mongodb";  // Импортируем необходимые классы и объекты из библиотеки MongoDB
const { MONGODB_URI, MONGODB_DATABASE } = process.env;  // Получаем URI подключения и название базы данных из переменных окружения

// Создаем экземпляр клиента MongoDB с использованием переданного URI и конфигурации версии API
const client = new MongoClient(MONGODB_URI, { 
  serverApi: { 
    version: ServerApiVersion.v1,  // Устанавливаем версию API MongoDB
    strict: true,  // Включаем строгий режим, который будет выдавать ошибки при использовании устаревших функций
    deprecationErrors: true,  // Включаем выдачу ошибок при использовании устаревших функций
  }, 
}); 

try { 
  // Подключаем клиент к серверу MongoDB
  await client.connect(); 
  // Выполняем команду ping для проверки успешного подключения к базе данных
  await client.db().command({ ping: 1 }); 
  console.log("Подключение к MongoDB успешно!");  // Выводим сообщение об успешном подключении
} catch (err) { 
  console.error(err);  // Логируем ошибку в случае, если произошел сбой при подключении
} 

// Экспортируем объект базы данных, чтобы можно было использовать его в других модулях
export const db = client.db(MONGODB_DATABASE);
