import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.svg'
import bloob1 from '../../assets/Vector(tia1).svg'
import bloob2 from '../../assets/Vector(tia2).svg'
import './Register.css'

const Register = () => {
  function cadastrarUsuario(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const cpf = document.getElementById('cpf').value;
    const password = document.getElementById('password').value;
    const passwordRepeat = document.getElementById('password-repeat').value;

    if (password !== passwordRepeat) {
        alert('As senhas não coincidem!');
        return;
    }

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, birthdate, cpf, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        alert(data.message || 'Cadastro realizado com sucesso!');
    })
    .catch(error => {
        console.error('Erro detalhado:', error);
        alert(error.error || 'Erro no cadastro!');
    });
}
  return (
    <div className="page-container">
      <div id="background-overlay"></div>
      <div id="navbar">
        <div id="container-nav">
          <Link to="/"><img src={logo} alt="Logo" id="logo-nav"/></Link>
        </div>
      </div>

      <div id="container-register">
        <h1>Registrar</h1>
        <form onSubmit={cadastrarUsuario}>
            <label htmlFor="name">Nome completo:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="phone">Telefone:</label>
            <input type="tel" id="phone" name="phone" required placeholder="(11) 91234-5678" />

            <label htmlFor="birthdate">Data de nascimento:</label>
            <input type="date" id="birthdate" name="birthdate" required />

            <label htmlFor="cpf">CPF:</label>
            <input type="text" id="cpf" name="cpf" required placeholder="000.000.000-00" />

            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" name="password" required />

            <label htmlFor="password">Repetir a Senha:</label>
            <input type="password" id="password-repeat" name="password" required />

            <button type="submit" id="register-button">Registrar</button>
        </form>
        <p>Já tem uma conta? <Link to="/login">Login</Link></p>
      </div>

      <img src={bloob1} alt="bloob1" id="bloob1" />
      <img src={bloob2} alt="bloob2" id="bloob2" />
      <footer> Created by InovaTech - 2025®</footer>
    </div>  
  )
}

export default Register
