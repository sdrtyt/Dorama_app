import React, { useState, useEffect } from "react";

const DoramaTracker = () => {
  const [popularDoramas, setPopularDoramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [minRating, setMinRating] = useState("");

  const fetchPopularDoramas = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/dorama/popular");
      const data = await response.json();
      setPopularDoramas(data.results || []);
    } catch (error) {
      console.error("Ошибка при загрузке популярных дорам:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:5000/dorama/search");
      if (searchQuery) url.searchParams.append("query", searchQuery);
      if (genre) url.searchParams.append("genre", genre);
      if (minRating) url.searchParams.append("minRating", minRating);

      const response = await fetch(url);
      const data = await response.json();
      setPopularDoramas(data.results || []);
    } catch (error) {
      console.error("Ошибка при поиске дорам:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularDoramas();
  }, []);

  return (
    <div className="container">
      <h1>Трекер дорам</h1>
      <div className="search-form">
        <input
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Все жанры</option>
          <option value="Романтика">Романтика</option>
          <option value="Драма">Драма</option>
        </select>
        <input
          type="number"
          placeholder="Мин. рейтинг"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <button onClick={handleSearch}>Искать</button>
      </div>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          {popularDoramas.map((dorama) => (
            <div key={dorama._id}>
              <h3>{dorama.title}</h3>
              <p>{dorama.genre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoramaTracker;
