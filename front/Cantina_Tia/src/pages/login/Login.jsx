import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.svg'
import bloob1 from '../../assets/Vector(tia1).svg'
import bloob2 from '../../assets/Vector(tia2).svg'
import './Login.css';
import { supabase } from '../../../lib/supabaseclient'; // Ajuste o caminho conforme necessário
// ... outros imports

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
        // 1. CHAMA O MÉTODO DE LOGIN DO SUPABASE
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });

        if (error) {
            // Trata erros do Supabase (ex: credenciais inválidas)
            throw new Error('Falha no login. Verifique seu e-mail e senha.');
        }

        // 2. LOGIN BEM-SUCEDIDO
        
        // O Supabase gerencia a sessão (token) automaticamente no localStorage.
        // Você pode acessar os dados do usuário através de 'data.user'.
        
        // Salvando informações adicionais, se necessário (o token é gerenciado internamente pelo Supabase)
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        // Limpando o erro e redirecionando
        setError('');
        console.log('Login bem-sucedido. Usuário:', data.user);
        navigate('/dashboard'); // Redireciona para o Dashboard

    } catch (err) {
        console.error('Erro no login:', err);
        // Exibe a mensagem de erro para o usuário
        setError(err.message); 
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
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />
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
