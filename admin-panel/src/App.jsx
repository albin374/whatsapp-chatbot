import React, { useState, useEffect } from 'react';
import './App.css';
import './Login.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Modals State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Category Form State
  const [newMainCategory, setNewMainCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');

  // Product Form State
  const [prodSku, setProdSku] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodScreenSize, setProdScreenSize] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [prodVesa, setProdVesa] = useState('');
  const [prodTags, setProdTags] = useState('');
  const [prodYoutube, setProdYoutube] = useState('');
  const [prodImage, setProdImage] = useState(null);
  const [prodDataSheet, setProdDataSheet] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(err => console.error(err));

    // Fetch products
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(err => console.error(err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Hint: admin@example.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mainCategory: newMainCategory, subCategory: newSubCategory })
      });
      if (response.ok) {
        const newCat = await response.json();
        setCategories([newCat, ...categories]);
        setShowAddCategoryModal(false);
        setNewSubCategory('');
        setNewMainCategory('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProdSku(product.sku || '');
      setProdName(product.name || '');
      setProdCategory(product.category_id || '');
      setProdScreenSize(product.screen_size || '');
      setProdWeight(product.weight_capacity || '');
      setProdVesa(product.max_vesa || '');
      setProdTags(product.tags || '');
      setProdYoutube(product.youtube_url || '');
    } else {
      setEditingProduct(null);
      setProdSku(''); setProdName(''); setProdCategory('');
      setProdScreenSize(''); setProdWeight(''); setProdVesa('');
      setProdTags(''); setProdYoutube('');
    }
    setProdImage(null);
    setProdDataSheet(null);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('sku', prodSku);
    formData.append('category_id', prodCategory);
    formData.append('name', prodName);
    formData.append('screen_size', prodScreenSize);
    formData.append('weight_capacity', prodWeight);
    formData.append('max_vesa', prodVesa);
    formData.append('tags', prodTags);
    formData.append('youtube_url', prodYoutube);
    
    if (prodImage) formData.append('productImage', prodImage);
    if (prodDataSheet) formData.append('dataSheet', prodDataSheet);

    try {
      const url = editingProduct 
        ? `http://localhost:3000/api/products/${editingProduct.id}` 
        : 'http://localhost:3000/api/products';
        
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        body: formData
      });
      
      if (response.ok) {
        const savedProd = await response.json();
        if (editingProduct) {
            setProducts(products.map(p => p.id === savedProd.id ? savedProd : p));
        } else {
            setProducts([savedProd, ...products]);
        }
        closeProductModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card glass-panel">
          <div className="login-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#paint0_linear)"/>
              <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient>
                <linearGradient id="paint1_linear" x1="2" y1="19.5" x2="22" y2="19.5" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient>
                <linearGradient id="paint2_linear" x1="2" y1="14.5" x2="22" y2="14.5" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient>
              </defs>
            </svg>
            <div>
              <h1 className="login-title">Admin Login</h1>
              <p className="login-subtitle">Sign in to manage your Chatbot</p>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loginError && <div className="error-message">{loginError}</div>}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary login-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#paint0_linear)"/>
            <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs>
          </svg>
          ChatAdmin
        </div>
        
        <ul className="nav-menu">
          <li className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            Categories
          </li>
          <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 20 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Products
          </li>
        </ul>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            {activeTab === 'categories' ? 'Categories Management' : 'Products Management'}
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => activeTab === 'categories' ? setShowAddCategoryModal(true) : openProductModal()}>
              {activeTab === 'categories' ? '+ Add Category' : '+ Add Product'}
            </button>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="dashboard-content animate-fade-in">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {activeTab === 'categories' ? (
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Main Category</th><th>Sub Category</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {categories.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center'}}>No categories found.</td></tr> : null}
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td style={{ fontWeight: 500 }}>{cat.mainCategory}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{cat.subCategory}</td>
                        <td><span className="badge badge-active">{cat.status}</span></td>
                        <td><button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>Image</th><th>Product ID (SKU)</th><th>Product Name</th><th>Category</th><th>Specs</th><th>Files</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.length === 0 ? <tr><td colSpan="7" style={{textAlign:'center'}}>No products found.</td></tr> : null}
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          {prod.image_url ? (
                            <img src={`http://localhost:3000/${prod.image_url}`} alt={prod.name} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px'}} />
                          ) : (
                            <div style={{width:'50px', height:'50px', background:'rgba(255,255,255,0.1)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem'}}>No Img</div>
                          )}
                        </td>
                        <td><span style={{ fontFamily:'monospace' }}>{prod.sku}</span></td>
                        <td style={{ fontWeight: 500 }}>{prod.name}</td>
                        <td><span className="badge badge-active">{prod.mainCategory} &gt; {prod.subCategory}</span></td>
                        <td style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>
                          Size: {prod.screen_size || 'N/A'}<br/>
                          Weight: {prod.weight_capacity || 'N/A'}<br/>
                          VESA: {prod.max_vesa || 'N/A'}
                        </td>
                        <td>
                          {prod.data_sheet_url && (
                            <a href={`http://localhost:3000/${prod.data_sheet_url}`} target="_blank" rel="noreferrer" style={{fontSize:'0.875rem'}}>📄 Data Sheet</a>
                          )}
                        </td>
                        <td><button onClick={() => openProductModal(prod)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
            <div className="glass-panel" style={{ width: '400px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Category</h2>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Main Category</label>
                  <input type="text" className="form-input" value={newMainCategory} onChange={(e) => setNewMainCategory(e.target.value)} placeholder="e.g. Products" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sub Category Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Cables" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowAddCategoryModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
            <div className="glass-panel" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Product ID / SKU</label>
                    <input type="text" className="form-input" value={prodSku} onChange={(e) => setProdSku(e.target.value)} placeholder="e.g. #PRD-1024" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-input" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. Premium Display Stand" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} style={{ backgroundColor: 'rgba(15,23,42,0.9)' }} required>
                    <option value="" disabled>Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.mainCategory} &gt; {cat.subCategory}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Screen Size</label>
                    <input type="text" className="form-input" value={prodScreenSize} onChange={(e) => setProdScreenSize(e.target.value)} placeholder="e.g. 32-65 inch" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight Capacity</label>
                    <input type="text" className="form-input" value={prodWeight} onChange={(e) => setProdWeight(e.target.value)} placeholder="e.g. 50kg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max VESA</label>
                    <input type="text" className="form-input" value={prodVesa} onChange={(e) => setProdVesa(e.target.value)} placeholder="e.g. 600x400" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input type="text" className="form-input" value={prodTags} onChange={(e) => setProdTags(e.target.value)} placeholder="e.g. new, premium, fast-shipping" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">YouTube Video Link</label>
                    <input type="url" className="form-input" value={prodYoutube} onChange={(e) => setProdYoutube(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Product Image {editingProduct && '(Leave empty to keep current)'}</label>
                    <input type="file" accept="image/*" onChange={(e) => setProdImage(e.target.files[0])} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }} required={!editingProduct} />
                  </div>
                  <div className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Data Sheet {editingProduct && '(Leave empty to keep current)'}</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setProdDataSheet(e.target.files[0])} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={closeProductModal} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem' }}>{editingProduct ? 'Save Changes' : 'Save Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
