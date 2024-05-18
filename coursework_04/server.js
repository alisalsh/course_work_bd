const express = require("express")
const { Client } = require("pg");


const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

const client = new Client({
    host: "localhost",
    user: "postgresrole",
    port: 5432,
    password: "root",
    database: "MovieTheatreDB"
});

client.connect();


app.get('/films', (req, res) => {
    client.query('SELECT * FROM film', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
        
    });
});

app.get('/users', (req, res) => {
    client.query('SELECT * FROM user_table', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
        
    });
});

app.get('/screening', (req, res) => {
    client.query('SELECT * FROM screening', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
    });
});

app.get('/ticket', (req, res) => {
    client.query('SELECT * FROM ticket', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
    });
});


app.get('/seats', (req, res) => {
    client.query('SELECT * FROM seat', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
    });
});

app.get('/ticketview', (req, res) => {
    client.query('SELECT * FROM ticket_view', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.send(err.message);
        }
    });
});


app.post('/users', async (req, res) => {
    try {
        const {user_name, user_email, user_password, user_role} = req.body;
        const newuser = await client.query(
            'INSERT INTO user_table (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *', [user_name, user_email, user_password, user_role]
        );
        res.json(newuser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


app.post('/screening', async (req, res) => {
    try {
        const {film_id, screening_time, screening_showd, hall} = req.body;
        const newshow = await client.query(
            'INSERT INTO screening (film_id, screening_time, screening_showd, hall) VALUES ($1, $2, $3, $4) RETURNING *', [film_id, screening_time, screening_showd, hall]
        );
        res.json(newshow.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/ticket', async (req, res) => {
    try {
      const tickets = req.body; 
      const results = await Promise.all(tickets.map((ticket) => {
        const { user_id, screening_id, seat_id, paid } = ticket;
        return client.query(
          'INSERT INTO ticket (user_id, screening_id, seat_id, paid) VALUES ($1, $2, $3, $4) RETURNING *',
          [user_id, screening_id, seat_id, paid]
        );
      }));
      res.json(results.map((result) => result.rows[0]));
    } catch (err) {
      console.error(err.message);
    }
  });



  app.put('/ticket/:ticket_id', async (req, res) => {
    try {
      const ticket_id = req.params.ticket_id;
      const result = await client.query(
        'UPDATE ticket SET paid = true WHERE ticket_id = $1',
        [ticket_id]
      );
      res.json({ message: `Ticket ${ticket_id} updated `});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating ticket' });
    }
  });






app.get('/', (req, res) => {
    res.send('<a href="/films">Films</a><br><a href="/users">Users</a><br><a href="/posters">Posters</a><br><a href="/screening">Screenings</a><br><a href="/seats">Seats</a><br><a href="/ticket">Ticket</a><br><a href="/ticketview">Ticket VIEW</a>');
});

app.get('/posters', (req, res) => {
    res.sendFile(__dirname + '/posters.json');
});

app.listen(port, () => {
    console.log('Server on http://localhost:3000'); 
});


