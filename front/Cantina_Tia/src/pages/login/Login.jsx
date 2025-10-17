import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.svg'
import bloob1 from '../../assets/Vector(tia1).svg'
import bloob2 from '../../assets/Vector(tia2).svg'
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function logar(event) {
    event.preventDefault();
    setError(''); // Limpa erros anteriores

    // Validação básica no frontend
    if (!email || !password) {
        setError('Email e senha são obrigatórios');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Usa a mensagem de erro do backend ou uma padrão
            throw new Error(data.error || 'Falha no login. Verifique suas credenciais.');
        }

        // Login bem-sucedido
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); // Redireciona para o Dashboard

    } catch (error) {
        console.error('Erro no login:', error);
        setError(error.message);
    }
}

  return (
    <div className="page-container">
      <div id="background-overlay"></div>
      <div id="navbar">
        <div id="container-nav">
            <Link to="/"><img src={logo} alt="Logo" id="logo-nav"/></Link>
        </div>
      </div>
      <div id="container-login">
          <h1>Login</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={logar}>
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
              <label htmlFor="password">Senha:</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" id="login-button">Entrar</button>
          </form>
          <p>Não tem uma conta? <Link to="/cadastrar">Registrar</Link></p>
      </div>
      <img src={bloob1} alt="bloob1" id="bloob1" />
      <img src={bloob2} alt="bloob2" id="bloob2" />
      <footer> Created by InovaTech - 2025®</footer>
    </div>
  )
}

export default Login
