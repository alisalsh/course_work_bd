import { Link, useLocation } from "react-router-dom";
import './Header.css'
import logo from './images/logo.svg'


const Header = () => {
    const location = useLocation();
    const ActiveLink = (path: string) => {
        return location.pathname === path ? "nav-link active-link" : "nav-link";
    };


    return (
        <header className="header">
           <img className="logo" src={logo} /> 
          
        </header>
       
      );
};

export default Header