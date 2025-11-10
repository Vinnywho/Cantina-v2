import React, { useState, useEffect } from 'react';
import './ContasAReceber.css';
import { supabase } from '../../../lib/supabaseclient';

// [ ... Importações de ícones aqui ... ]
import { FaBell, FaClock, FaUserCircle, FaTachometerAlt, FaDollarSign, FaChartBar, FaCalendarAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowDown, IoMdCheckboxOutline } from 'react-icons/io';


const ContasAReceber = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função Assíncrona para buscar os dados
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
      console.error('Erro ao buscar contas:', err.message);
      setError('Falha ao carregar dados. Tente novamente.');
      setContas([]);
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

      
      <header className="top-header"> {/* ... */}</header>
      <div className="main-content-area">
        <aside className="sidebar"> {/* ... */} </aside>

        <main className="content-body">
          <h2 className="content-title">Contas a Receber</h2>
          
          <div className="filter-bar"> {/* ... */} </div>
          
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
                          <FaTrashAlt className="action-icon" />
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