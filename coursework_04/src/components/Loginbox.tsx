import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Loginbox.css';

export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_password: string;
  user_role: boolean;
}

const Loginbox: React.FC = () => {
  const [user, setUsers] = useState<User[]>([]);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userToLogin = user.find((user) => user.user_name === username && user.user_password === password);
    if (userToLogin) {
      if (userToLogin.user_role) {
        navigate('/addfilms/adminpage');
        localStorage.setItem('loggedInUser', userToLogin.user_name);
        window.location.reload()
      } else {
        const userData = {
          username: userToLogin.user_name,
          userId: userToLogin.user_id
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        navigate('/')
        window.location.reload()
      }
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };


  return (
    <div className='login-box'>
      <h1>Войти в аккаунт</h1>
      <form onSubmit={handleLogin}>
        <label>
          Имя пользователя
        </label>
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label>
          Пароль
        </label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="submit">Войти</button>
        {loginError && <div style={{
                          color: 'red',
                          textAlign: 'center',
                          width: '100%',
                          padding: '10px',
        }}>{loginError}</div>}
        </form>

        <div style={{
                          textAlign: 'center',
                          width: '100%',
                          padding: '10px',
                          marginTop: '1px',
                          marginLeft: '13px' }}>
          <Link to="/registration" className={ActiveLink("/registration")}>у меня ещё нет аккаунта</Link>
        </div>

    </div>

    

  );
};

export default Loginbox;
