import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import './ContasAReceber.css';

import { FaBell, FaClock, FaUserCircle, FaTachometerAlt, FaDollarSign, FaChartBar, FaCalendarAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowDown, IoMdCheckboxOutline } from 'react-icons/io';


const ContasAReceber = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContas = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('contas_a_pagar')
        .select('*')
        .order('vencimento', { ascending: true });

      if (error) {
        throw error;
      }
      
      setContas(data || []);
    } catch (err) {
      setError('Falha ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const deleteConta = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta conta?')) {
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contas_a_pagar')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setContas(contas.filter(conta => conta.id !== id));
      
    } catch (err) {
      alert('Não foi possível deletar a conta.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContas();
  }, []); 

  const totalReceber = contas.reduce((sum, conta) => sum + (conta.valor || 0), 0);
  const totalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalReceber);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  if (loading) return <div className="loading-message">Carregando Contas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="app-container">

      <header className="top-header">
        <div className="header-title">Contas a Pagar</div>
        <div className="header-icons">
          <FaBell className="icon" />
          <FaClock className="icon" />
          <FaUserCircle className="icon user-avatar" />
        </div>
      </header>

      <div className="main-content-area">
        
        <aside className="sidebar">
          <div className="logo"></div>
          <nav className="menu-nav">
            <div className="menu-item"> <FaTachometerAlt /> Visão Geral/Dashboard </div>
            <div className="menu-item active"> <FaDollarSign /> Contas a Receber </div>
            <div className="menu-item"> <FaDollarSign /> Contas a Receber </div>
            <div className="menu-item"> <FaChartBar /> Fluxo de Caixa </div>
            <div className="menu-item"> <IoMdCheckboxOutline /> Lançamentos </div>
            <div className="menu-item"> <FaChartBar /> Relatórios </div>
            <div className="menu-item"> <FaChartBar /> Relatórios </div>
            <div className="menu-item"> <FaCalendarAlt /> Conciliação Bancária </div>
          </nav>
        </aside>

        <main className="content-body">
          <h2 className="content-title">Contas a Receber</h2>
          
          <div className="filter-bar">
            <div className="dropdown-container"> Contas (Caixa e Bancos) <IoIosArrowDown /> </div>
            <div className="filter-options">
              <div className="filter-group"> <label>Período:</label> <div className="dropdown-container">Forncedor <IoIosArrowDown /></div> </div>
              <div className="filter-group"> <label>Status:</label> <div className="dropdown-container"> Aplice: A Vencer <FaCalendarAlt /> </div> </div>
              <button className="btn-primary">Aplicar Filtros</button>
              <button className="btn-secondary">Nova Conta</button>
            </div>
          </div>
          
          <div className="total-card">
            Total a Receber: **{totalFormatado}**
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vencimento</th>
                  <th>Fornecedor</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor (R$)</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contas.map((conta) => (
                  <tr key={conta.id}>
                    <td>{formatarData(conta.vencimento)}</td>
                    <td>{conta.fornecedor}</td>
                    <td>{conta.descricao}</td>
                    <td>{conta.categoria}</td>
                    <td>{new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(conta.valor)}</td>
                    <td>
                      <span className={`status-badge status-${conta.status.toLowerCase().replace(' ', '-')}`}>
                        {conta.status}
                      </span>
                    </td>
                    <td>
                        <div className="action-icons">
                           <input type="checkbox" />
                          <FaEdit className="action-icon" />
                          <FaTrashAlt 
                            className="action-icon delete-icon"
                            onClick={() => deleteConta(conta.id)} 
                          />
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        {contas.length === 0 && !loading && (
            <div className="empty-state">Nenhuma conta encontrada.</div>
        )}
        </main>
      </div>
    </div>
  );
};

export default ContasAReceber;