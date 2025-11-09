// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Dashboardcss.css';
import Navbar from '../../components/Navbar/Navbar';

// --- Configurações Supabase (Substitua com suas chaves reais) ---
const SUPABASE_URL = "https://tganxelcsfitizoffvyn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYW54ZWxjc2ZpdGl6b2ZmdnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTgzMTMsImV4cCI6MjA3NzQzNDMxM30.ObZQ__nbVlej-lPE7L0a6mtGj323gI1bRq4DD4SkTeM";
const PEDIDOS_API_URL = `${SUPABASE_URL}/rest/v1/pedidos`;

// Cabeçalhos para todas as requisições ao Supabase
const API_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Content-Profile': 'public', 
};
// -----------------------------------------------------------------

// Função auxiliar para obter a classe CSS do status
const getStatusClass = (status) => {
  switch (status) {
    case 'PRONTO':
      return 'ponto--verde';
    case 'EM PREPARO':
    case 'EM ESPERA':
      return 'ponto--laranja';
    case 'CANCELADO':
      return 'ponto--vermelho';
    case 'FINALIZADO':
      return 'ponto--azul';
    default:
      return '';
  }
};

// Componente para renderizar um item de pedido
const OrderItem = ({ order, onUpdateStatus }) => {
  const isHistory = order.status_pedido === 'FINALIZADO' || order.status_pedido === 'CANCELADO';
  
  // Mapeia e exibe os itens do pedido
  const itemDisplay = order.pedidos_produtos.map((item, index) => (
    <span key={index}>— {item.produto_id.nome} ({item.produto_id.emoji}) x{item.quantidade}</span>
  ));
  
  // Botões de Ação visíveis apenas para pedidos não finalizados/cancelados
  const renderActions = () => (
    <div className="order-actions">
      <button 
        className="btn-pronto" 
        onClick={() => onUpdateStatus(order.id, 'PRONTO')} 
        disabled={order.status_pedido === 'PRONTO'}
      >
        Pronto
      </button>
      <button 
        className="btn-cancelar" 
        onClick={() => onUpdateStatus(order.id, 'CANCELADO')}
        disabled={order.status_pedido === 'CANCELADO'}
      >
        Cancelar
      </button>
    </div>
  );

  return (
    <>
      {/* Linha principal do pedido */}
      <li className={`order ${isHistory ? 'orders--history' : ''}`}>
        <i className={`ponto ${getStatusClass(order.status_pedido)}`} />
        <span className="order-code">{order.id.toString().padStart(3, '0')}</span>
        <span className="order-name">{order.user_app_id.name}</span>
        
        {!isHistory ? renderActions() : <span className="order-status-history">{order.status_pedido}</span>}
      </li>
      
      {/* Linha dos itens do pedido (Sub-linha) */}
      <li className="order sub">
        <div className="order-items">
          {isHistory ? <span>— {itemDisplay[0]}... ({order.pedidos_produtos.length} itens)</span> : itemDisplay}
        </div>
      </li>
    </>
  );
};


export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL para buscar pedidos com dados aninhados (JOINs) e ordenação por data
  const FETCH_URL = `${PEDIDOS_API_URL}?select=id,status_pedido,data_pedido,user_app_id(name),pedidos_produtos(quantidade,produto_id(nome,emoji))&order=data_pedido.asc`;

  // Função para buscar pedidos do Supabase usando FETCH
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(FETCH_URL, { 
        method: 'GET',
        headers: API_HEADERS 
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }, [FETCH_URL]);

  // Função para atualizar o status do pedido via PATCH usando FETCH
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${PEDIDOS_API_URL}?id=eq.${orderId}`, 
        {
          method: 'PATCH',
          headers: API_HEADERS,
          body: JSON.stringify({ status_pedido: newStatus }),
        }
      );

      if (response.status !== 204) { // 204 No Content é o retorno padrão do Supabase PATCH
        // Tenta ler o corpo da resposta se o status não for 204 para obter detalhes do erro
        const errorBody = await response.text();
        throw new Error(`Erro ao atualizar status. Status: ${response.status}. Detalhe: ${errorBody.substring(0, 100)}...`);
      }

      // Atualiza o estado local para refletir a mudança instantaneamente
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status_pedido: newStatus } : order
        )
      );

      alert(`Pedido #${orderId.toString().padStart(3, '0')} atualizado para ${newStatus}.`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert(err.message || "Falha na comunicação com o servidor.");
    }
  };

  // Efeito para carregar dados na montagem
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Filtragem e Classificação dos pedidos
  const activeOrders = orders.filter(o => o.status_pedido !== 'FINALIZADO' && o.status_pedido !== 'CANCELADO');
  const historyOrders = orders.filter(o => o.status_pedido === 'FINALIZADO' || o.status_pedido === 'CANCELADO');

  // KPIS
  const currentOrderCode = activeOrders.length > 0 ? activeOrders[0].id.toString().padStart(3, '0') : 'N/A';
  const lastCompletedOrder = historyOrders.find(o => o.status_pedido === 'FINALIZADO');
  const lastCompletedOrderCode = lastCompletedOrder ? lastCompletedOrder.id.toString().padStart(3, '0') : 'N/A';


  if (loading) return <div className="page wrap">Carregando pedidos...</div>;
  if (error) return <div className="page wrap">Erro: {error}</div>;

  return (
    <div className="page">
      <Navbar />

      <section className="wrap">
        <div className="status">
          <span className="status-label">Status:</span>
          <span className="chip"><i className="ponto ponto--verde" /> Pronto</span>
          <span className="chip"><i className="ponto ponto--laranja" /> Em preparo</span>
          <span className="chip"><i className="ponto ponto--vermelho" /> Cancelado</span>
          <span className="chip"><i className="ponto ponto--azul" /> Finalizado</span>
        </div>

        <div className="grid">
          {/* FILA */}
          <div className="card fila">
            <h2 className="titulo">FILA ({activeOrders.length})</h2>
            <div className="divider" />
            <ul className="orders">
              {activeOrders.map(order => (
                <OrderItem key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))}
              {activeOrders.length === 0 && <p className='order sub'>Nenhum pedido ativo no momento.</p>}
            </ul>
          </div>

          <div className="right-col">
            <div className="kpis">
              <div className="kpi">
                <p className="kpi-label">Próximo Pedido</p>
                <p className="kpi-number">{currentOrderCode}</p>
              </div>
              <div className="kpi">
                <p className="kpi-label">Último Concluído</p>
                <p className="kpi-number">{lastCompletedOrderCode}</p>
              </div>
            </div>

            <div className="card history">
              <h2 className="titulo">HISTÓRICO ({historyOrders.length})</h2>
              <div className="divider" />
              <ul className="orders orders--history">
                {historyOrders.map(order => (
                   <OrderItem key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
                ))}
                 {historyOrders.length === 0 && <p className='order sub'>Nenhum histórico recente.</p>}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}