const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
let ara = []

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // папка для сохранения файлов
  },
  filename: function (req, file, cb) {
    // сохраняем файл с оригинальным именем + timestamp

    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

pool.connect()
    .then(() => console.log("Подключение к базе данных успешно"))
    .catch((err) => console.error("Ошибка подключения к базе данных", err));

// Определяем маршрут для GET-запроса
app.get("/data", async (req, res) => {
  try {
    // Выполняем SQL-запрос
    const result = await pool.query("SELECT * FROM  products");
    // Отправляем результат в формате JSON
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка выполнения запроса", err);
    res.status(500).json({ error: "Ошибка выполнения запроса" });
  }
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

});

app.post("/admin", async (req, res) => {
  let info = req.body;
  try {
    // Выполняем SQL-запрос
    const result = await pool.query("SELECT * FROM  users");
    // Отправляем результат в формате JSON
    const result2 = result.rows[0].login == info.username & result.rows[0].password == info.password ? res.send({ access: 'true' }) : res.send({ access: 'false2' });
  } catch (err) {
    console.error("Ошибка выполнения запроса", err);
    res.status(500).json({ error: "Ошибка выполнения запроса" });
  }
});

app.get("/data/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    // Выполняем SQL-запрос
    const result = await pool.query(
      `SELECT * FROM products WHERE id = ${userId}`
    );
    // Отправляем результат в формате JSON
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка выполнения запроса", err);
    res.status(500).json({ error: "Ошибка выполнения запроса" });
  }
});

app.delete('/data/:id', async (req, res) => {
  const id = req.params.id
  try {
    // SQL-запрос для удаления записи по id
    const queryText = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(queryText, [id]);
    // Проверка, была ли удалена запись
    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Item with id ${id} not found.` });
    }
    // Возвращаем сообщение об успешном удалении
    res.json({ message: `Item with id ${id} deleted.`, deletedItem: result.rows[0] });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  ara.push(req.file.filename)
});

app.post("/add", (req, res) => {
  let info = req.body;
  let result = 'http://localhost:3002/image/' + ara.at(-1)
  const query = `INSERT INTO products (name, size, description, price_for_one_beam, price_per_cubic_meter,image_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  const values = [
    info.name,
    info.size,
    info.description,
    info.price_for_one_beam,
    info.price_per_cubic_meter,
    result
  ];
  pool.query(query, values); 
});


app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Изображение не найдено');
    }
  });
});


// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
