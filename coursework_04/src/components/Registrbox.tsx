import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_password: string;
  user_role: boolean;
}

const Registrbox = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newUseremail, setNewUseremail] = useState("");
  const [newUserpassword, setNewUserpassword] = useState("");
  const [registerError, setRegError] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const url = "http://localhost:3000/users";
      const data = {
        user_name: newUsername,
        user_email: newUseremail,
        user_password: newUserpassword,
        user_role: false
      };
      
      try {
        const response = await fetch(url);
        const users = await response.json();
       
        const existingUser = users.find((user: User) => user.user_name === newUsername);
        if (existingUser) {
          console.log("User already exists");
          setRegError('Пользователь с таким именем уже существует, придумайте другое');

        } else {

          const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await response.json();
          const userData = {
            userId: json.user_id,
            username: json.user_name,
          };
          console.log("Успех:", JSON.stringify(json));
          localStorage.setItem('loggedInUser', JSON.stringify(userData));
          navigate('/')
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };
    




  return (
    <div className='login-box'>
      <h1>Зарегистрироваться</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Имя пользователя
        </label>
        <input type="text" value={newUsername} onChange={event =>setNewUsername(event.target.value)} />
        <label>
          Почта
        </label>
        <input type="text" value={newUseremail} onChange={event =>setNewUseremail(event.target.value)} />
        <label>
          Пароль
        </label>
        <input type="password" value={newUserpassword} onChange={event =>setNewUserpassword(event.target.value)} />
        <button type="submit">Зарегистрироваться</button>
        {registerError && <div style={{
                          color: 'red',
                          textAlign: 'center',
                          width: '100%',
                          padding: '10px',
        }}>{registerError}</div>}
        </form>

        <div style={{
                          textAlign: 'center',
                          width: '100%',
                          padding: '10px',
                          marginTop: '1px',
                          marginLeft: '13px' }}>
          <Link to="/login" className={ActiveLink("/login")}>у меня уже есть аккаунт</Link>
        </div>

    </div>

  );
};
export default Registrbox;



