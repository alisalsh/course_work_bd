import { useEffect, useState } from "react";


interface Film {
  film_id: number;
  film_name: string;
}

interface Screening {
  screening_id: number;
  film_id: number;
  screening_showd: number;
  screening_time: string;
}


const AScreens: React.FC = () => {
  const [screens, setScreens] = useState<Screening[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(1);

  useEffect(() => {
    fetch('http://localhost:3000/screening')
      .then(response => response.json())
      .then(data => {
        setScreens(data);
      })
      .catch(error => {
        console.error(error);
      });

    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(data => {
        setFilms(data);
      })
      .catch(error => {
        console.error(error);
      });

  }, []);


  const groupedScreens: Record<string, Screening[]> = screens.reduce((acc, screening) => {
    const key = String(screening.film_id);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(screening);
    return acc;
  }, {} as Record<string, Screening[]>);


  return (
    
    <div>
    <div className="filter-container">
      <div>
        <div>
          <button onClick={() => setSelectedDay(1)}>Сегодня</button>
          <button onClick={() => setSelectedDay(2)}>Завтра</button>
          <button onClick={() => setSelectedDay(3)}>Послезавтра</button>
        </div>
      </div>
    </div>
    <div className="shows-boxes">
    <ul className="shows-list">
      {Object.values(groupedScreens).map((groupedScreenings, index) => (
        <li key={index}>
          <div className="film-details">
            <div>
              <h2>{films.find(film => film.film_id === groupedScreenings[0].film_id)?.film_name}</h2>
            </div>
            <div>
  <div className="poster-time-container">

    <div className="screening-time-container">
      <div>Сеансы на выбранный день:</div>
      <div className="screening-time">
      {groupedScreenings
                .filter(screening => {
                  if (selectedDay === 1) {
                    return screening.screening_showd === 1;
                  } else if (selectedDay === 2) {
                    return screening.screening_showd === 2;
                  } else if (selectedDay === 3) {
                    return screening.screening_showd === 3;
                  } else {
                    return true;
                  }
                })
                .map(screening => (
                  <p key={screening.screening_id}>{screening.screening_time.slice(0, 5)}</p>
                ))}
                
      </div>
    </div>
  </div>
</div>
          </div>
        </li>
      ))}
    </ul>
    </div>
</div>
  );
};

export default AScreens;