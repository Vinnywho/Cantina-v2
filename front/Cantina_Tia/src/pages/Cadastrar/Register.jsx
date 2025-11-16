import React from 'react';
import { Link } from 'react-router-dom';

// Certifique-se de que os caminhos dos assets e do supabaseclient estão corretos
import logo from '../../assets/Logo.svg';
import bloob1 from '../../assets/Vector(tia1).svg';
import bloob2 from '../../assets/Vector(tia2).svg';
import './Register.css';

import { supabase } from '../../../lib/supabaseclient'; // Caminho para sua instância Supabase

const Register = () => {
    
    // Função para lidar com o cadastro do usuário
    async function cadastrarUsuario(event) { 
        event.preventDefault();

        // 1. Coleta de dados do formulário
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
            const { error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { 
                        name: name, 
                        phone: phone, 
                        birthdate: birthdate, 
                        cpf: cpf 
                    }
                }
            });

            if (authError) {
                throw new Error(authError.message);
            }
            
            console.log('Sucesso: Usuário Auth criado.');
            alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
            
        } catch (error) {
            console.error('Erro detalhado:', error.message);
            alert(error.message || 'Erro no cadastro!');
        }
    }

    // Estrutura JSX do componente
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

                    <label htmlFor="password-repeat">Repetir a Senha:</label>
                    <input type="password" id="password-repeat" name="password-repeat" required /> 

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