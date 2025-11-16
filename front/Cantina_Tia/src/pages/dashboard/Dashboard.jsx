import React, { useState, useEffect, useCallback } from 'react';
import './Dashboardcss.css';
import Navbar from '../../components/Navbar/Navbar';
import { supabase } from '../../../lib/supabaseclient';

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

const OrderItem = ({ order, onUpdateStatus }) => {
  const isHistory = order.status_pedido === 'FINALIZADO' || order.status_pedido === 'CANCELADO';
  
  const itemDisplay = order.pedidos_produtos.map((item, index) => (
    <span key={index}>— {item.produto_id.name} ({item.produto_id.image}) x{item.quantidade}</span>
  ));
  
  const userName = order.user_app_id?.name || 'Usuário Desconhecido';

  const renderActions = () => (
    <div className="order-actions">
      <button 
        className="btn-pronto" 
        onClick={() => onUpdateStatus(order.id, 'FINALIZADO')}
        disabled={order.status_pedido === 'FINALIZADO' || order.status_pedido === 'CANCELADO'}
      >
        Finalizar
      </button>
      <button 
        className="btn-cancelar" 
        onClick={() => onUpdateStatus(order.id, 'CANCELADO')}
        disabled={order.status_pedido === 'CANCELADO' || order.status_pedido === 'FINALIZADO'}
      >
        Cancelar
      </button>
    </div>
  );

  return (
    <>
      <li className={`order ${isHistory ? 'orders--history' : ''}`}>
        <i className={`ponto ${getStatusClass(order.status_pedido)}`} />
        <span className="order-code">{order.id.toString().padStart(3, '0')}</span>
        <span className="order-name">{userName}</span>
        
        {!isHistory ? renderActions() : <span className="order-status-history">{order.status_pedido}</span>}
      </li>
      
      <li className="order sub">
        <div className="order-items">
          {isHistory 
            ? <span>— {itemDisplay[0]}... ({order.pedidos_produtos.length} itens)</span> 
            : itemDisplay
          }
        </div>
      </li>
    </>
  );
};


export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
     const { data, error: fetchError } = await supabase
      .from('pedidos')
      .select(`
        id,
        status_pedido,
        data_pedido,
        user_app_id(name),
        pedidos_produtos(quantidade, produto_id(name, image))
      `)
      .order('data_pedido', { ascending: false });

      if (fetchError) throw fetchError;
      
      setOrders(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err.message);
      setError("Não foi possível carregar os pedidos. Verifique RLS e conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ status_pedido: newStatus })
        .eq('id', orderId);
        
      if (updateError) throw updateError;

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status_pedido: newStatus } : order
        )
      );

      alert(`Pedido #${orderId.toString().padStart(3, '0')} atualizado para ${newStatus}.`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err.message);
      alert(`Falha ao atualizar status. Detalhe: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const activeOrders = orders.filter(o => o.status_pedido !== 'FINALIZADO' && o.status_pedido !== 'CANCELADO');
  const historyOrders = orders.filter(o => o.status_pedido === 'FINALIZADO' || o.status_pedido === 'CANCELADO');

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