import { Link, useLocation } from "react-router-dom";
import './Header.css'
import logo from './images/logo.svg'


const Header = () => {
    const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };
    const loggedInUser = localStorage.getItem('loggedInUser');
let userData;
let username;

if (loggedInUser) {
  userData = JSON.parse(loggedInUser);
  username = userData.username;
} else {
  username = 'default'; 
}
    return (
        <header className="header">
           <img className="logo" src={logo} /> 
           <h1>Добрый день, {username}!</h1>
           <nav className="nav">
                <Link to="/" className={ActiveLink("/")}>Фильмы</Link>
                <Link to="/screening" className={ActiveLink("/screening")}>Сеансы</Link>
                <Link to="/login" className={ActiveLink("/login")} onClick={() => {
                    localStorage.removeItem('loggedInUser');
                    }}>
                    Выйти
                </Link>
                
                
            </nav>
        </header>
       
      );
};

export default Header

