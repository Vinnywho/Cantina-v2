// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Navbar1.css';
import logo from '../../assets/LogoGrande.svg';

const Navbar1 = () => {
  const [open, setOpen] = useState(false);

  return (
    <header id="navbar-home">
      <div id="container-nav-home">
        <img src={logo} alt="Logo" id="logo-nav-home" />
        <nav id="nav-menu-home" data-open={open}>
            <a href="#home" className="nav-items-home">Home</a>
            <a href="#cardapio" className="nav-items-home">Cardápio</a>
            <a href="#app" className="nav-items-home">App</a>
            <a href="#contatos" className="nav-items-home">Contato</a>
        </nav>
        <Link to="/login"><button id="login-btn">Login</button></Link>
        <div className="nav-actions">
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="burger"
            onClick={() => setOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar1;