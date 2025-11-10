import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient'; 
import './ContasAReceber.css';

import { FaBell, FaClock, FaUserCircle, FaTachometerAlt, FaDollarSign, FaChartBar, FaCalendarAlt, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown, IoMdCheckboxOutline } from 'react-icons/io';

// ----------------------------------------------------
// Componente Navbar
// ----------------------------------------------------
const Navbar = () => (
  <nav id="navbar">
    <div id="container-nav">
      <div id="logo-nav">FINANCEIRO</div>
      <div className="nav-actions">
        <FaBell className="icon" />
        <FaClock className="icon" />
        <FaUserCircle className="icon user-avatar" />
      </div>
    </div>
  </nav>
);

// ----------------------------------------------------
// Componente Modal de Cadastro
// ----------------------------------------------------
const ModalCadastro = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vencimento: '',
    fornecedor: '',
    descricao: '',
    categoria: '',
    valor: '',
    status: 'A Vencer',
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.valor <= 0 || !formData.fornecedor || !formData.vencimento) {
      alert("Preencha Vencimento, Fornecedor e Valor corretamente.");
      return;
    }
    onSave(formData);
    setFormData({ vencimento: '', fornecedor: '', descricao: '', categoria: '', valor: '', status: 'A Vencer' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nova Conta a Receber</h3>
          <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          
          <label htmlFor="vencimento">Vencimento:</label>
          <input type="date" id="vencimento" name="vencimento" value={formData.vencimento} onChange={handleChange} required />
          
          <label htmlFor="fornecedor">Fornecedor:</label>
          <input type="text" id="fornecedor" name="fornecedor" value={formData.fornecedor} onChange={handleChange} required />
          
          <label htmlFor="valor">Valor (R$):</label>
          <input type="number" id="valor" name="valor" step="0.01" value={formData.valor} onChange={handleChange} required />

          <label htmlFor="descricao">Descrição:</label>
          <input type="text" id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />
          
          <label htmlFor="categoria">Categoria:</label>
          <input type="text" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} />

          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="A Vencer">A Vencer</option>
            <option value="Em Atraso">Em Atraso</option>
          </select>
          
          <button type="submit" className="btn-primary">Salvar Conta</button>
        </form>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// Componente Principal ContasAReceber
// ----------------------------------------------------
const ContasAReceber = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- Funções de API ---

  const fetchContas = useCallback(async () => {
    setError(null);
    try {
      // AJUSTE: MUDANÇA PARA 'contas_a_receber'
      const { data, error } = await supabase
        .from('contas_a_receber')
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
  }, []);

  const addConta = async (newConta) => {
    setShowModal(false);
    setLoading(true);
    try {
      // AJUSTE: MUDANÇA PARA 'contas_a_receber'
      const { data, error } = await supabase
        .from('contas_a_receber')
        .insert([newConta])
        .select();

      if (error) {
        throw error;
      }

      setContas(prevContas => [...prevContas, data[0]]);
      alert("Conta adicionada com sucesso!");
      
    } catch (err) {
      alert(`Falha ao adicionar conta: ${err.message}`);
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
      // AJUSTE: MUDANÇA PARA 'contas_a_receber'
      const { error } = await supabase
        .from('contas_a_receber')
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
  }, [fetchContas]); 

  const totalReceber = contas.reduce((sum, conta) => sum + (conta.valor || 0), 0);
  const totalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalReceber);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="page">
      <Navbar />
      <ModalCadastro 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={addConta} 
      />

      <div className="app-container">
        
        <aside className="sidebar">
          <div className="logo-sidebar">Controle F.</div>
          <nav className="menu-nav">
            <div className="menu-item"> <FaTachometerAlt /> Visão Geral/Dashboard </div>
            <div className="menu-item active"> <FaDollarSign /> Contas a Receber </div>
            <div className="menu-item"> <FaDollarSign /> Contas a Pagar </div> {/* Ajustado para Pagar */}
            <div className="menu-item"> <FaChartBar /> Fluxo de Caixa </div>
            <div className="menu-item"> <IoMdCheckboxOutline /> Lançamentos </div>
            <div className="menu-item"> <FaChartBar /> Relatórios </div>
            <div className="menu-item"> <FaCalendarAlt /> Conciliação Bancária </div>
          </nav>
        </aside>

        <main className="content-body">
          <h2 className="content-title">Contas a Receber</h2>
          
          <div className="filter-bar">
            <div className="dropdown-container"> Contas (Caixa e Bancos) <IoIosArrowDown /> </div>
            <div className="filter-options">
              <div className="filter-group"> <label>Período:</label> <div className="dropdown-container">Fornecedor <IoIosArrowDown /></div> </div>
              <div className="filter-group"> <label>Status:</label> <div className="dropdown-container"> Aplice: A Vencer <FaCalendarAlt /> </div> </div>
              <button className="btn-primary">Aplicar Filtros</button>
              <button className="btn-secondary" onClick={() => setShowModal(true)}>Nova Conta</button>
            </div>
          </div>
          
          {loading && <div className="loading-message">Carregando dados...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <>
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
              
            {contas.length === 0 && (
                <div className="empty-state">Nenhuma conta encontrada.</div>
            )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContasAReceber;