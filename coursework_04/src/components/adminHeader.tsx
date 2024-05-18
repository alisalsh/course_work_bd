import { Link, useLocation } from "react-router-dom";
import './Header.css'
import logo from './images/logo.svg'
const loggedInUser = localStorage.getItem('loggedInUser');


const AdminHeader = () => {
    const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };


    return (
        <header className="header">
           <img className="logo" src={logo} /> 
           <h1>Добро пожаловать, {loggedInUser}!</h1>
           <nav className="nav">
                <Link to="/addfilms/adminpage" className={ActiveLink("/addfilms/adminpage")}>Сеансы</Link>
                <Link to="/login" className={ActiveLink("/login")} onClick={() => {
                    localStorage.removeItem('loggedInUser');
                    }}>
                    Выйти
                </Link>
                
                
            </nav>
        </header>
       
      );
};

export default AdminHeader

