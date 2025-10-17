// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/Logo.svg';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header id="navbar-dashboard">
      <div id="container-nav">
        <img src={logo} alt="Logo" id="logo-nav" />
        <nav id="nav-menu" data-open={open}>
          <NavLink to="/dashboard" className="nav-items" onClick={() => setOpen(false)}>Pedidos</NavLink>
          <NavLink to="/menu" className="nav-items" onClick={() => setOpen(false)}>Cardápio</NavLink>
          <NavLink to="/estoque" className="nav-items" onClick={() => setOpen(false)}>Estoque</NavLink>
          <NavLink to="/contabilidade" className="nav-items" onClick={() => setOpen(false)}>Contabilidade</NavLink>
        </nav>
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

export default Navbar;