const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5001;

// Подключение к MongoDB
mongoose.connect("mongodb://localhost:27017/doramaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Подключение к базе данных MongoDB успешно!");
}).catch((err) => {
  console.error("Ошибка подключения к базе данных:", err);
});

// Схема для дорамы
const doramaSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
  imageUrl: String
});

const Dorama = mongoose.model("Dorama", doramaSchema);

app.use(cors()); // Настройка CORS
app.use(express.json()); // Поддержка JSON

// Получение популярных дорам
app.get("/dorama/popular", async (req, res) => {
  try {
    const popularDoramas = await Dorama.find(); // Все дорамы
    res.json({ results: popularDoramas });
  } catch (error) {
    console.error("Ошибка при загрузке популярных дорам:", error);
    res.status(500).json({ error: "Не удалось загрузить популярные дорамы" });
  }
});

// Поиск дорам
app.get("/dorama/search", async (req, res) => {
  try {
    const { query, genre, minRating } = req.query;
    const filter = {};
    if (query) filter.title = { $regex: query, $options: "i" };
    if (genre) filter.genre = genre;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const filteredDoramas = await Dorama.find(filter);
    res.json({ results: filteredDoramas });
  } catch (error) {
    console.error("Ошибка при поиске дорам:", error);
    res.status(500).json({ error: "Ошибка при поиске дорам" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
