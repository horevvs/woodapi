const express = require("express");
const app = express();
const port = 3002;
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Middleware для парсинга JSON
app.use(express.json());
const imagesDirectory = path.join(__dirname, "images");
const jsonFilePath = path.join(__dirname, "/data/data.json");



app.use("/images", express.static(imagesDirectory));

// Настройка статического сервера для раздачи изображений

app.use('/images', express.static(imagesDirectory));

app.use(cors());
app.use(bodyParser.json());
// Получить всех пользователей
app.get("/data", (req, res) => {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка чтения файла" });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: "Ошибка парсинга JSON" });
    }
  });
});


app.get("/data/:id", (req, res) => {
  let userId = req.params.id;
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка чтения файла" });
    }
    try {
      const jsonData = JSON.parse(data);
      let result = jsonData[userId];
      res.json(result);
    } catch (parseError) {
      res.status(500).json({ error: "Ошибка парсинга JSON" });
    }
  });
});

app.post("/submit", (req, res) => {
  let info = req.body;
  res.status(201).send("Данные успешно созданы");
  const token = "8043829281:AAHtH99ylTKEna5IezEkPYGjVYhFKY6QfUM"; // Замените на токен вашего бота
  const chatId = "@wooden_hvs"; // Замените на ID вашего канала или чата (например, @my_channel)
  const message = info; // Сообщение, которое вы хотите отправить
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Message sent:", data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

app.get('/data/:id', (req, res) => {
    const userId = req.params.id;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        try {
            const jsonData = JSON.parse(data);
            let result = jsonData[userId]
            res.json(result)
        } catch (parseError) {
            res.status(500).json({ error: 'Ошибка парсинга JSON' });
        }
    });
});

app.post('/submit', (req, res) => {
    let info = req.body
    res.status(201).send('Данные успешно созданы');
    const token = '8043829281:AAHtH99ylTKEna5IezEkPYGjVYhFKY6QfUM'; // Замените на токен вашего бота
    const chatId = '@wooden_hvs'; // Замените на ID вашего канала или чата (например, @my_channel)
    const message = info; // Сообщение, которое вы хотите отправить
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent:', data);
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });

});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});


// const express = require('express');
// const fetch = require('node-fetch');

// const app = express();
// app.use(express.json());

// const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
// const CHANNEL_ID = '@your_channel_username'; // или используйте идентификатор канала

// app.post('/api/your-endpoint', async (req, res) => {
//     const message = req.body.message; // Предполагаем, что сообщение приходит в теле запроса

//     try {
//         await sendMessageToTelegramChannel(message);
//         res.status(200).send('Message sent to Telegram channel');
//     } catch (error) {
//         console.error('Error sending message to Telegram:', error);
//         res.status(500).send('Error sending message');
//     }
// });

// async function sendMessageToTelegramChannel(message) {
//     const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
//     const body = {
//         chat_id: CHANNEL_ID,
//         text: message,
//     };

//     const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//     }
// }

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

