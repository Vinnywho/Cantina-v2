import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.svg'
import bloob1 from '../../assets/Vector(tia1).svg'
import bloob2 from '../../assets/Vector(tia2).svg'
import './Register.css'

import { supabase } from '../../../lib/supabaseclient'; // Assumindo que supabaseclient.js está no mesmo nível

const Register = () => {
  async function cadastrarUsuario(event) { // Torna a função assíncrona
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
    
    try {
        // 1. REGISTRA O USUÁRIO NO SISTEMA DE AUTENTICAÇÃO DO SUPABASE (auth.users)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Adiciona o nome para ser usado no email de confirmação ou metadados
                data: { name: name }
            }
        });

        if (authError) {
            // Trata erros de autenticação (ex: email já existe)
            throw new Error(authError.message);
        }

        // Se o registro de AUTH for bem-sucedido:
        
        // 2. INSERE OS DADOS ADICIONAIS NA SUA TABELA 'users'
        // NOTA: É importante que o 'id' na sua tabela 'users' seja preenchido com o 'id' do usuário do Supabase
        
        // Este é o ID único do usuário criado pelo Supabase
        const userId = authData.user.id; 

        const { error: dbError } = await supabase
            .from('users') // Nome da sua tabela
            .insert([
                { 
                    id: userId, // Usamos o ID do Auth para manter a relação 1:1
                    name: name, 
                    email: email, 
                    phone: phone, 
                    birthdate: birthdate, 
                    cpf: cpf, 
                    password: password // NOTA: Em um cenário real, você não deve armazenar a senha aqui
                }
            ]);

        if (dbError) {
            // Se houver erro no DB, logamos e alertamos
            console.error('Erro ao inserir dados adicionais:', dbError);
            throw new Error('Cadastro de usuário realizado, mas houve erro ao salvar os dados adicionais.');
        }

        console.log('Sucesso:', authData);
        alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
        
    } catch (error) {
        console.error('Erro detalhado:', error.message);
        alert(error.message || 'Erro no cadastro!');
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
