import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  // State bawaan
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [scrolled, setScrolled] = useState(false); 
  
  // STATE KHUSUS ADMIN
  const [isAdmin] = useState(true); // Set true buat testing admin
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  
  // State baru buat icon mata di form Tambah Akun
  const [showAddPassword, setShowAddPassword] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setShowDropdown(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo"><Link to="/">Jadwal!n</Link></div>
        
        <ul className="nav-links">
          <li><Link to="/tentang-kami">Tentang Kami</Link></li>
          <li className="nav-item-dropdown" ref={dropdownRef}>
            <span className="dropdown-trigger" onClick={() => setShowDropdown(!showDropdown)}>
              Layanan 
              <svg className={`chevron ${showDropdown ? 'up' : 'down'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
            {showDropdown && (
              <div className="dropdown-menu glass-dropdown">
                <a onClick={() => scrollToSection('info')} style={{cursor: 'pointer'}}>Info Terkini</a>
                <a onClick={() => scrollToSection('agenda')} style={{cursor: 'pointer'}}>Agenda Sekolah</a>
                <a onClick={() => scrollToSection('jadwal')} style={{cursor: 'pointer'}}>Jadwal</a>
              </div>
            )}
          </li>
          <li><a href="https://www.smkn46jaktim.sch.id/" target="_blank" rel="noreferrer">Forensix</a></li>
        </ul>

        {/* --- BAGIAN KANAN (ICONS) --- */}
        <div className="nav-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          
          {isAdmin && (
            <>
              {/* 1. Icon Add User */}
              <div className="admin-icon-wrapper" onClick={() => setShowAddUserModal(true)} style={{ cursor: 'pointer', background: 'white', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>

              {/* 2. Icon Ubah Password */}
              <div className="admin-icon-wrapper" onClick={() => setShowChangePassModal(true)} style={{ cursor: 'pointer', background: 'white', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
            </>
          )}

          {/* 3. Icon User Original (Login) */}
          <div className="user-icon-wrapper" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="white" className="solid-user-icon" width="28" height="28">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.4c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
      </nav>

      {/* --- MODAL 1: LOGIN (USER BIASA) --- */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>&times;</button>
            <div className="form-container">
              <h3>LOGIN TO JADWAL!N</h3>
              <input type="text" placeholder="USERNAME" />
              <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                <input type={showPassword ? "text" : "password"} placeholder="PASSWORD" style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box', marginBottom: '0' }} />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', display: 'flex' }}>
                  {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path></svg>}
                </span>
              </div>
              <a href="#" className="forgot-pass">Forgot your password?</a>
              <button className="submit-btn">LOGIN</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TAMBAH KETUA KELAS (KHUSUS ADMIN) --- */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowAddUserModal(false)}>&times;</button>
            <div className="form-container">
              <h3>Tambah Ketua Kelas</h3>
              
              <input type="text" placeholder="Username" />
              
              {/* WRAPPER PASSWORD + ICON MATA KHUSUS FORM INI */}
              <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
                <input 
                  type={showAddPassword ? "text" : "password"} 
                  placeholder="Password Awal" 
                  style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box', marginBottom: '0' }} 
                />
                <span 
                  onClick={() => setShowAddPassword(!showAddPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', display: 'flex' }}
                >
                  {showAddPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path></svg>
                  )}
                </span>
              </div>

              <input type="text" placeholder="Nama Lengkap" />
              <input type="text" placeholder="Kelas (Mis: X RPL 1)" />
              
              <button className="submit-btn">Buat Akun</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: UBAH PASSWORD (KHUSUS ADMIN) --- */}
      {showChangePassModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowChangePassModal(false)}>&times;</button>
            <div className="form-container">
              <h3>CHANGE PASSWORD</h3>
              <input type="password" placeholder="OLD PASSWORD" />
              <input type="password" placeholder="NEW PASSWORD" />
              <button className="submit-btn">UPDATE PASSWORD</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;