import { useState, useEffect } from 'react';
import './Paying.css';


interface Ticket {
    ticket_id: number;
    user_id: number;
    screening_id: number;
    seat_id: number;
    paid: boolean;
    user_email: string;
    film_name: string;
    screening_time: string;
    seat_number: string;
    seat_row: string;
}

const Payment = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  useEffect(() => {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          setLoggedInUserId(userData.userId);
      }

      fetch('http://localhost:3000/ticketview')
         .then(response => response.json())
         .then(data => {
              // Фильтруем билеты по user_id
              const userTickets = data.filter((ticket: Ticket) => ticket.user_id === loggedInUserId);

              const mergedTickets = userTickets.reduce((acc: Ticket[], ticket: Ticket) => {
                  const existingTicket = acc.find(t => t.screening_id === ticket.screening_id && t.seat_row === ticket.seat_row);
                  if (existingTicket) {
                    existingTicket.seat_number +=` , ${ticket.seat_number}`;
                  } else {
                    acc.push(ticket);
                  }
                  return acc;
                }, []);
        
                // Group tickets by screening_id and seat_row
                const groupedTickets = mergedTickets.reduce((acc: any, ticket: Ticket) => {
                  const key = '${ticket.screening_id}_${ticket.seat_row}';
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(ticket);
                  return acc;
                }, {});
        
                const formattedTickets = mergedTickets.reduce((acc: Ticket[], ticket: Ticket) => {
                  const existingTicket = acc.find(t => t.screening_id === ticket.screening_id);
                  if (existingTicket) {
                    existingTicket.seat_number +=` , ${ticket.seat_number}`;
                    existingTicket.seat_row +=` , ${ticket.seat_row}`;
                  } else {
                    acc.push(ticket);
                  }
                  return acc;
                }, []);
                
        
                setTickets(formattedTickets);
              });
          }, [loggedInUserId]);
        
          async function handlePayment(ticket_id:number) {
            try {
              const response = await fetch(`http://localhost:3000/ticket/${ticket_id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
          
              if (response.ok) {
                window.location.reload();
                console.log(`Ticket ${ticket_id} updated successfully`);
              } else {
                console.error(`Error updating ticket ${ticket_id}`);
              }
            } catch (error) {
              console.error(`Error handling payment`);
            }
          }
          async function handlePaymentLoop(tickets: Ticket[]) {
            for (const ticket of tickets) {
              if (!ticket.paid) {
                await handlePayment(ticket.ticket_id);
              }
            }
          }
         
            return (
              <div>
                <div className="ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket.ticket_id} className="ticket">
                    <p className="ticket-info">
                      Email: {ticket.user_email}
                      <br />
                      Фильм: {ticket.film_name}
                      <br />
                      Время: {ticket.screening_time.slice(0, 5)}
                      <br />
                      Место: {ticket.seat_number}
                      <br />
                      Ряд: {ticket.seat_row}
                    </p>
                    {ticket.paid? (
                      <p className="paid">Оплачено ✔ </p>
                    ) : (
                      <button className='pay-button' onClick={() => handlePaymentLoop(tickets)}>Оплатить все</button>
                      
                    )}
                  </div>
                ))}
              </div>
              </div>
            );
          };
          
          export default Payment;