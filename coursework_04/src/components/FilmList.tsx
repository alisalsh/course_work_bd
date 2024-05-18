import React, { useState, useEffect } from 'react';
import './FilmList.css';
import { Link, useLocation } from 'react-router-dom';

export interface Film {
  film_id: number;
  film_name: string;
  film_year: string;
  film_duration: string;
  film_genre: string;
  film_director: string;
  film_description: string;
}

interface Poster {
  film_id: number;
  poster: string;
}

const FilmList: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [posters, setPosters] = useState<{ [key: number]: string }>({});
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };

  useEffect(() => {
    if (showPopup) {
      setPopupStyle({
        backgroundImage: 'rgba(0, 0, 0, 0)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      });
    } else {
      setPopupStyle({});
    }
  }, [showPopup]);

  useEffect(() => {
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(data => setFilms(data));

    fetch('http://localhost:3000/posters')
      .then(response => response.json())
      .then((data: Poster[]) => {
        const postersObject: { [key: number]: string } = {};
        data.forEach((poster) => {
          postersObject[poster.film_id] = poster.poster;
        });
        setPosters(postersObject);
      });
  }, []);

  const handleFilmCardClick = (film: Film) => {
    setSelectedFilm(film);
    setShowPopup(true);
  };

  return (
    <div className='film-card'>
      {films.map((film) => (
        <div key={film.film_id} className={`card ${posters[film.film_id] ? '' : 'no-poster'}`} onClick={() => handleFilmCardClick(film)}>
          {posters[film.film_id] && (
            <img src={posters[film.film_id]} alt='Film Poster' />
          )}
          <h1>{film.film_name}</h1>
          <hr/>
          <div className='card-content'>
            <p>{film.film_year}, {film.film_genre}, {film.film_duration} </p>
          </div>
          <Link to="/screening" className={ActiveLink("/screening")}>Посмотреть сеансы</Link>
        </div>
      ))}
      {selectedFilm && (
        <div className={`popup ${showPopup ? 'show' : ''}`}>
          <button className='close-button' onClick={() => setShowPopup(false)}>
          ✖
          </button>
          <div className='popup-content'>
            <div className='poster'>
              <img src={posters[selectedFilm.film_id]} alt='Film Poster' />
            </div>
            <div className='text'>
              <h2>{selectedFilm.film_name}</h2>
              <p>{selectedFilm.film_description}</p>
              <p>{selectedFilm.film_genre}</p>
              <p>Реж: {selectedFilm.film_director}</p>
              <p>Длительность: {selectedFilm.film_duration}</p>
              <hr/>
              <Link to="/screening" className={ActiveLink("/screening")}>Посмотреть сеансы</Link>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmList;
