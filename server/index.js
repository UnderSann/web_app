require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Импорт для создания HTTP-сервера
const WebSocket = require('ws'); // Импорт WebSocket-сервера

const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes');
const errorHandler = require('./middleware/ErrorhandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler);
/*
app.get('/',(req,res) => {
    res.status(200).json({message:'Я люблю аринку!!!!'})
})
*/

//=====================================================================================
// Создаём HTTP-сервер для объединения с WebSocket
const server = http.createServer(app);

// Настраиваем WebSocket-сервер
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Новое WebSocket-соединение');

    // Отправляем сообщение при подключении
    ws.send(JSON.stringify({ message: 'Добро пожаловать в систему!' }));

    // Обработка сообщений от клиента
    ws.on('message', (message) => {
        console.log(`Сообщение от клиента: ${message}`);
        // Рассылаем всем клиентам уведомление
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ newOrder: message }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Соединение закрыто');
    });
});
//=====================================================================================

// Запуск сервера
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () =>
            console.log(`Сервер запущен на порту ${PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();
