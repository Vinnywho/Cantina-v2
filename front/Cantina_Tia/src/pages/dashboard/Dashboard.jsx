// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import './Dashboardcss.css';
import Navbar from '../../components/Navbar/Navbar';

export default function Dashboard() {
  return (
    <div className="page">
      {/* NAVBAR */}
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
            <h2 className="titulo">FILA</h2>
            <div className="divider" />
            <ul className="orders">
              <li className="order">
                <i className="ponto ponto--verde" />
                <span className="order-code">025</span>
                <span className="order-name">Vinicius Cardoso de Lima</span>
                <div className="order-items">
                  <span>— Croassaint (presunto e queijo)</span>
                </div>
              </li>

              <li className="order">
                <i className="ponto ponto--laranja" />
                <span className="order-code">026</span>
                <span className="order-name">Erik Raimundo</span>
                <div className="order-items">
                  <span>— Coxinha</span>
                  <span>— Monster energy (Original)</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="right-col">
            <div className="kpis">
              <div className="kpi">
                <p className="kpi-label">Pedido Atual</p>
                <p className="kpi-number">025</p>
              </div>
              <div className="kpi">
                <p className="kpi-label">Pedido Anterior</p>
                <p className="kpi-number">024</p>
              </div>
            </div>

            <div className="card history">
              <h2 className="titulo">HISTÓRICO</h2>
              <div className="divider" />
              <ul className="orders orders--history">
                <li className="order">
                  <i className="ponto ponto--azul" />
                  <span className="order-code">025</span>
                  <span className="order-name">Larissa de Almeida Lira</span>
                </li>
                <li className="order sub">
                  <span>— Batata frita (média)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
