import { useState, useEffect } from 'react';
import './NewForm.css';


interface Film {
  film_id: number;
  film_name: string;
}
const NewShow = () => {
  const [newScreeningTime, setNewScreeningTime] = useState("");
  const [newHall, setnewHall] = useState("");
  const [NewShowD, setNewShowD] = useState("");
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<number>(0);
  const [selectedFilmId, setSelectedFilmId] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>("");


  useEffect(() => {
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(data => {
        setFilms(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
 

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const url = "http://localhost:3000/screening";
    const data = {
      film_id: selectedFilmId,
      screening_time: newScreeningTime,
      screening_showd: NewShowD,
      hall: newHall,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log("Успех:", JSON.stringify(json));
      setSuccessMessage("Сеанс успешно добавлен");
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const filmOptions = films.map((film) => (
    <option key={film.film_id} value={film.film_id} onClick={() => setSelectedFilmId(film.film_id)}>
      {film.film_name}
    </option>
  ));

  return (
    <div>
      {successMessage && (
        <p style={{ textAlign: "center", color: "green" }}>{successMessage}</p>
      )}
<form onSubmit={handleSubmit} className="form">
  <h1>Добавить новый сеанс</h1>
  <div className="form-field">
    <label>Фильм:</label>
    <select value={selectedFilm} onChange={(event) => {
      const selectedFilmId = parseInt(event.target.value, 10);
      setSelectedFilm(selectedFilmId);
      setSelectedFilmId(selectedFilmId); 
      }}>
      <option value={0}>Выбрать фильм</option>
      {filmOptions}
    </select>
  </div>
  <div className="form-field">
    <label>Укажите время</label>
    <input type="text" value={newScreeningTime} onChange={(event) => setNewScreeningTime(event.target.value)} />
  </div>
  <div className="form-field">
    <label>День:</label>
    <select value={NewShowD} onChange={(event) => setNewShowD(event.target.value)}>
      <option value="1">Сегодня</option>
      <option value="2">Завтра</option>
      <option value="3">Послезавтра</option>
    </select>
    <label>Зал:</label>
    <select value={newHall} onChange={(event) => setnewHall(event.target.value)}>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>
    
  </div>
  <button type="submit">Создать новый сеанс</button>
</form>
      </div>

    )

};

export default NewShow;
