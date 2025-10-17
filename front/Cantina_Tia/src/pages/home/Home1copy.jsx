import React from 'react'
import { Link } from 'react-router-dom';
import './home1.css';
import Navbar1 from '../../components/NavbarHome/Navbar1';
import { useState } from "react";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import ProductCard from "../../components/ProductCard/ProductCard";
import paoCarneLouca from "../../assets/pao-carne-louca.jpg";
import paoDeQueijo from "../../assets/pao-de-queijo.jpg";
import folhados from "../../assets/folhados.jpg";
import marmitinhas from "../../assets/marmitinhas.jpg";
import saladadefrutas from "../../assets/Salada-de-Frutas-Especial_02a701d90_2684.png";
import sorvete from "../../assets/DSC_0050-Edit-1-960x750.png";
import bolo from "../../assets/Receita-de-Calda-de-chocolate-para-bolo-Essa-Receita-Funciona-5.jpg";
import torta from "../../assets/1d22d96039f98608bc9338debb1b4579.jpg";
import sucos from "../../assets/copos_com_sucos_de_frutas_-_suco_natural_-_assai_atacadista.jpg";
import refrigerantes from "../../assets/casa-de-caboclo-refrigerante-lata.jpg";
import energeticos from "../../assets/melhor-energetico-custo-beneficio-os-5-melhores-em-2025.webp";
import cafe from "../../assets/café-caro.jpg";
import aplicativo from "../../assets/Aplicativo.png";
import appstore from "../../assets/vecteezy_app-store-download-button-in-white-colors-download-on-the_12871374 1.png";
import playstore from "../../assets/vecteezy_google-play-store-download-button-in-white-colors-download_12871364 1.png";
import logo from "../../assets/Logovetorizada.svg";
import instagram from "../../assets/instagram.svg";
import whatsapp from "../../assets/whatsapp-svgrepo-com 1.svg";
import mail from "../../assets/mail.svg";
import backgroundImage from "../../assets/group 31.png";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Salgados");
  
  const categories = ["Salgados", "Sobremesas", "Bebidas"];
  
  const products = [
    {
      id: 1,
      category: "Salgados",
      image: paoCarneLouca,
      title: "Pão com carne louca",
      price: "R$ 8,50",
      description: "Pãozinho gostosinho favorito da galera.",
    },
    {
      id: 2,
      category: "Salgados",
      image: paoDeQueijo,
      title: "Pão de queijo",
      price: "R$ 5,50",
      description: "Pãozinho gostosinho bonitinho cheirosinho, favorito da galera.",
    },
    {
      id: 3,
      category: "Salgados",
      image: folhados,
      title: "Folhados",
      price: "R$ 8,00",
      description: "Croassaints de diversos sabores super gostosos e recheados.",
    },
    {
      id: 4,
      category: "Salgados",
      image: marmitinhas,
      title: "Marmitinhas",
      price: "R$ 18,00",
      description: "Marmitinhas gostosinha, com direito ao programa de fidelidade",
    },
    {
      id: 5,
      category: "Sobremesas",
      image: saladadefrutas,
      title: "Salada de frutas",
      price: "R$ 8,50",
      description: "Salada de frutas fresquinha e deliciosa.",
    },
    {
      id: 6,
      category: "Sobremesas",
      image: sorvete,
      title: "Sorvete Los Los",
      price: "A partir de R$ 10,00",
      description: "Sorvete Los Los, o melhor sorvete da FECAP.",
    },
    {
      id: 7,
      category: "Sobremesas",
      image: bolo,
      title: "Bolo com calda de chocolate",
      price: "R$ 7,50",
      description: "Bolo fofinho com calda de chocolate delicioso.",
    },
    {
      id: 8,
      category: "Sobremesas",
      image: torta,
      title: "Doce da casa",
      price: "R$ 18,00",
      description: "Pudim, torta de limão ou morango, bolo gelado e muito mais.",
    },
    {
      id: 9,
      category: "Bebidas",
      image: sucos,
      title: "Sucos naturais",
      price: "R$ 6,50",
      description: "Sucos naturais de diversos sabores, feitos na hora.",
    },
    {
      id: 10,
      category: "Bebidas",
      image: refrigerantes,
      title: "Refrigerantes",
      price: "R$ 7,50",
      description: "Refrigerantes de diversos sabores, feitos na hora.",
    },
    {
      id: 11,
      category: "Bebidas",
      image: energeticos,
      title: "Energéticos",
      price: "R$ 8,50",
      description: "Energéticos de diversos sabores, feitos na hora.",
    },
    {
      id: 12,
      category: "Bebidas",
      image: cafe,
      title: "Café",
      price: "R$ 4,00",
      description: "Café quentinho para te acordar de manhã.",
    },
  ];
  
  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  return ( 
    <div className="page-container-home">
      <div id="background-overlay"></div>
      <div id="navbar">
        <Navbar1/>
      </div>
      <div className="home" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <section id="home">
          <h2 className='carnelouca'>O MELHOR PÃO COM CARNE LOUCA DA FECAP</h2>
          <h4 id="descricaolandingpage">10 ANOS DE COMEDORIA DA TIA, VENHA JÁ CONHECER! </h4>
          <h4 id="descricaolandingpage">Localizada no 1º andar do Bloco C </h4>
          <a href="https://www.canva.com/design/DAGet9pmafQ/xdcO-PvnBJ11qnyJH0LYdQ/view?utm_content=DAGet9pmafQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h59a309e793" 
                      target="_blank" 
                      id="cardapio" 
                      rel="noopener noreferrer">Cardápio Digital
          </a>
      </section>
      </div>

      <section id="favoritos">
          <h2 id="titulo-favoritos">Favoritos da casa:</h2>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              description={product.description}
            />
          ))}
          
        </section>
        <a href="https://www.canva.com/design/DAGet9pmafQ/xdcO-PvnBJ11qnyJH0LYdQ/view?utm_content=DAGet9pmafQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h59a309e793" 
                    target="_blank" 
                    id="cardapio-baixo" 
                    rel="noopener noreferrer">Ver mais
        </a>
      </section>

      <section id="app">
        <img src={aplicativo} alt="telas App" />
        <div>
          <h2 id="titulo-app">Acesse já nosso aplicativo</h2>
          <h4>Cansado de esperar? Agora você tem o menu completo da Comedoria da Tia na palma da sua mão. Baixe o aplicativo e descubra a maneira mais rápida, fácil e segura de pedir seus pratos, lanches, sobremesas e bebidas favoritos.</h4>
          <div id="app-store-buttons">
            <img src={appstore} alt="" id="app-store-button"/>
            <img src={playstore} alt="" id="play-store-button"/>
          </div>
        </div>
      </section>
      <section id="contatos">
        <img src={logo} alt="" />
        <div className="inf">
          <div id="nav-footer">
            <a href="#home" className="nav-items-home">Home</a>
            <a href="#cardapio" className="nav-items-home">Cardápio</a>
            <a href="#app" className="nav-items-home">App</a>
            <a href="#contato" className="nav-items-home">Contato</a>
          </div>
          <div id="redes">
            <a href="https://www.instagram.com/comedoriadatiablococ" target='_blank'><img src={instagram} alt="Instagram" /></a>
            <img src={whatsapp} alt="WhatsApp" /> 
            <img src={mail} alt="E-mail" />
          </div>
        </div>
      </section>
      <footer>Criado por Vinicius Lima - InovaTech</footer>
    </div>
  )
}

export default Home
