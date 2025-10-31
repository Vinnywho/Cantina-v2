import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import './Menu.css';
// 1. IMPORTAÇÃO DO CLIENTE SUPABASE
import { supabase } from '../../../lib/supabaseclient';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estados para o formulário do modal
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productEmoji, setProductEmoji] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  // Estados para o formulário de categoria
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');

  // 2. ATUALIZANDO: FUNÇÃO DE BUSCA DE DADOS (GET)
  const fetchData = async () => {
    try {
      // Busca Produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*'); // '*' retorna todas as colunas
        
      if (productsError) throw productsError;

      // Busca Categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
        
      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert(error.message || "Não foi possível carregar os dados do cardápio.");
    }
  };

  const filteredProducts = products.filter(product => {
    // ... (Lógica de filtro permanece a mesma)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchData();
  }, []);
  // ... (Efeitos e Handlers de modal/categoria permanecem os mesmos)
  
  // Popula o formulário quando o modal abre para edição
  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductPrice(editingProduct.price);
      setProductCategory(editingProduct.category_id);
      setProductEmoji(editingProduct.image);
      setProductQuantity(editingProduct.quantity);
    } else {
      // Limpa o formulário para adicionar novo produto
      setProductName('');
      setProductPrice('');
      setProductCategory('');
      setProductEmoji('');
      setProductQuantity('');
    }
  }, [editingProduct, isModalOpen]);

  // Popula o formulário de categoria
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setCategoryIcon(editingCategory.icon);
    } else {
      setCategoryName('');
      setCategoryIcon('');
    }
  }, [editingCategory, isCategoryModalOpen]);


  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };
  
  // 3. ATUALIZANDO: SALVAR/EDITAR PRODUTO (POST/PUT)
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const productData = {
      name: productName,
      price: parseFloat(productPrice),
      category_id: parseInt(productCategory),
      image: productEmoji, // Correspondente à coluna 'image'
      quantity: parseInt(productQuantity),
    };
    
    try {
      if (editingProduct) {
        // EDIÇÃO (UPDATE)
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id); // 'eq' é a cláusula WHERE
          
        if (error) throw error;
        
      } else {
        // ADIÇÃO (INSERT)
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
      }

      handleCloseModal();
      fetchData(); // Re-fetch data to update the list
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(error.message || 'Falha ao salvar produto.');
    }
  };

  // 4. ATUALIZANDO: SALVAR/EDITAR CATEGORIA (POST/PUT)
  const handleCategoryFormSubmit = async (event) => {
    event.preventDefault();
    const categoryData = { name: categoryName, icon: categoryIcon };

    try {
      if (editingCategory) {
        // EDIÇÃO (UPDATE)
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
          
        if (error) throw error;
        
      } else {
        // ADIÇÃO (INSERT)
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);
          
        if (error) throw error;
      }

      handleCloseCategoryModal();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert(error.message || 'Falha ao salvar categoria.');
    }
  };

  // 5. ATUALIZANDO: DELETAR CATEGORIA (DELETE)
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria? Atenção: Se houver produtos associados, a exclusão irá falhar devido à Chave Estrangeira!')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);

        if (error) throw error;

        fetchData();
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        // Mensagem mais informativa sobre a restrição de FK
        alert('Erro ao remover categoria. Verifique se não há produtos associados a ela.' || error.message);
      }
    }
  };

  // 6. ATUALIZANDO: DELETAR PRODUTO (DELETE)
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
          
        if (error) throw error;

        fetchData(); // Re-fetch data
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert(error.message || 'Falha ao remover produto.');
      }
    }
  };

  return (
    <div className="menu-page">
      <Navbar />
      
      <div className="menu-container">
        {/* Categories */}
        {/* ... (Todo o restante do JSX permanece o mesmo) */}
        
        <div className="categories-section">
          {categories.map((category) => (
            <div key={category.id} className="category-btn-wrapper">
              <button
                onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <div className="category-icon">{category.icon}</div>
                <span>{category.name}</span>
              </button>
              <div className="category-actions">
                  <button className="category-action-btn" onClick={() => handleOpenEditCategoryModal(category)}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="category-action-btn delete" onClick={() => handleDeleteCategory(category.id)}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
              </div>
            </div>
          ))}
          <button className="category-btn add-category" onClick={handleOpenAddCategoryModal}>
            <div className="category-icon">+</div>
            <span>+ Categoria</span>
          </button>
        </div>

        {/* Search and Add Product */}
        <div className="menu-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <button className="add-product-btn" onClick={handleOpenAddModal}>
            + Produto
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          <h2>Produtos</h2>
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-quantity">Em estoque: {product.quantity}</span>
                  <div className="product-footer">
                    <span className="product-price">R$ {Number(product.price).toFixed(2)}</span>
                    <div className="product-actions">
                      <button className="edit-btn" onClick={() => handleOpenEditModal(product)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="product-name">Nome do Produto</label>
            <input
              type="text"
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-price">Preço</label>
            <input
              type="number"
              id="product-price"
              step="0.01"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-quantity">Quantidade</label>
            <input
              type="number"
              id="product-quantity"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-category">Categoria</label>
            <select
              id="product-category"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product-emoji">Emoji (ícone)</label>
            <input type="text" id="product-emoji" maxLength="2" value={productEmoji} onChange={(e) => setProductEmoji(e.target.value)} />
          </div>
          <button type="submit" className="submit-btn">
            {editingProduct ? 'Salvar Alterações' : 'Salvar Produto'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={handleCloseCategoryModal}>
        <h2>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h2>
        <form className="modal-form" onSubmit={handleCategoryFormSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Nome da Categoria</label>
            <input type="text" id="category-name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="category-icon">Emoji (ícone)</label>
            <input type="text" id="category-icon" value={categoryIcon} onChange={(e) => setCategoryIcon(e.target.value)} maxLength="2" />
          </div>
          <button type="submit" className="submit-btn">
            {editingCategory ? 'Salvar Alterações' : 'Salvar Categoria'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Menu;