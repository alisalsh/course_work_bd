import { useEffect, useState } from "react";
import './Screens.css'
import './Popups.css';
import { useNavigate } from "react-router-dom";

interface Film {
  film_id: number;
  film_name: string;
}

interface Poster {
  film_id: number;
  poster: string;
}

interface Screening {
  screening_id: number;
  film_id: number;
  screening_showd: number;
  screening_time: string;
}

interface Seat {
  seat_id: number;
  seat_row: number;
  seat_number: number;
  hall: string;
}

interface Ticket {
  ticket_id: number;
  screening_id: number;
  seat_id: number;
}


const Screens: React.FC = () => {
  const [tickets, setTicket] = useState<Ticket[]>([]);
  const [screens, setScreens] = useState<Screening[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(1);
  const [selectedScreens, setSelectedScreens] = useState<Screening | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [, setPopupStyle] = useState({});
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [currentScreeningId, setCurrentScreeningId] = useState<number | null>(null);
  const navigate = useNavigate();


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

    fetch('http://localhost:3000/posters')
      .then(response => response.json())
      .then(data => {
        setPosters(data);
      })
      .catch(error => {
        console.error(error);
      });

        fetch('http://localhost:3000/seats')
          .then(response => response.json())
          .then(data => {
              setSeats(data);
          })
          .catch(error => {
            console.error(error);
          });

          fetch('http://localhost:3000/ticket')
          .then(response => response.json())
          .then(data => {
              setTicket(data);
          })
          .catch(error => {
            console.error(error);
          });

  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (selectedScreens && tickets.find(ticket => ticket.seat_id === seat.seat_id && ticket.screening_id === selectedScreens.screening_id)) return; // do nothing if seat is booked
    if (selectedSeats.find((s) => s.seat_id === seat.seat_id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat_id!== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };


  const handlecreensClick = (screening: Screening) => {
    setCurrentScreeningId(screening.screening_id);
    setSelectedScreens(screening);
    setShowPopup(true);
  };

  const groupedScreens: Record<string, Screening[]> = screens.reduce((acc, screening) => {
    const key = String(screening.film_id);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(screening);
    return acc;
  }, {} as Record<string, Screening[]>);

  const handleSubmitTicket = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const url = "http://localhost:3000/ticket";
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userData = JSON.parse(loggedInUser || '{}');
    if (!userData.userId) {
      console.error('User ID is not defined');
      return; 
    }
    const ticketdata = selectedSeats.map((seat) => ({
      user_id: Number(userData.userId),
    screening_id: currentScreeningId, 
    seat_id: seat.seat_id,
    paid: false
  }));
  console.log(ticketdata);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(ticketdata),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log("Успех:", JSON.stringify(json));
      navigate('/ticketpayment');
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  return (
    <div>
    <div className="filter-container">
      <div>
        <h1>Выберите день</h1>
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
    <div className="poster-container">
    <img src={posters.find(poster => poster.film_id === groupedScreenings[0].film_id)?.poster} alt="Poster" />
    </div>
    <div className="screening-time-container">
      <div>Сеансы на выбранный день:</div>
      <div className="screening-time">
      {groupedScreenings
            .filter(screening => {
              switch (selectedDay) {
                case 1:
                  return screening.screening_showd === 1;
                case 2:
                  return screening.screening_showd === 2;
                case 3:
                  return screening.screening_showd === 3;
                default:
                  return true;
              }
            })
                .map(screening => (
                  <p key={screening.screening_id} onClick={() => handlecreensClick(screening)} >{screening.screening_time.slice(0, 5)}</p>
                ))}
      </div>
    </div>
  </div>
</div>

{selectedScreens && (
        <div className={`popupscreens ${showPopup ? 'show' : ''}`}>
          <button className='close-button' onClick={() => setShowPopup(false)}>
          ✖
          </button>
          <div className="seat-container">
          <h1 style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 1, 
                  marginBottom: 10 
                }}>Выберите места</h1>
        <div className="top-border">
          {Array.from({ length: Math.max(...seats.map(seat => seat.seat_row)) }, (_, index) => (
            <div key={index} className="seat-row">
              <div> {index + 1} ряд......</div>
              {seats
            .filter(seat => seat.seat_row === index + 1)
            .map((seat, i) => (
                  <span 
                        className={`seat
                          ${seat.seat_number}
                          ${selectedSeats.find((s) => s.seat_id === seat.seat_id)? 'selected' : ''}
                          ${tickets.find(ticket => ticket.seat_id === seat.seat_id && ticket.screening_id === selectedScreens.screening_id)? 'booked' : ''}
                        `}
                        key={i}
                        onClick={() => handleSeatClick(seat)}
                        style={tickets.find(ticket => ticket.seat_id === seat.seat_id && ticket.screening_id === selectedScreens.screening_id)? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                      >
                        {seat.seat_number} 
                      </span>
                ))}
            </div>
          ))}
        </div>
        {selectedSeats.length > 0 && (
          <div className ="selected-seats">
            <p>
                {Object.entries(selectedSeats.reduce((acc: { [key: number]: number[] }, seat) => {
                    acc[seat.seat_row] = acc[seat.seat_row] || [];
                    acc[seat.seat_row].push(seat.seat_number);
                    return acc;
                }, {})).map(([row, numbers]) => (
                    <span key={row}>
                    Ряд: {row}<br />
                    Места: {numbers.join(', ')}<br />
                    </span>
                    
                ))}
            </p>
            <button className="submiting" onClick={handleSubmitTicket}>
        Подтвердить
      </button>
          </div>
        )}
      </div>
        </div>
      )}
          </div>
        </li>
      ))}
    </ul>
    </div>
</div>
);

};

export default Screens;

