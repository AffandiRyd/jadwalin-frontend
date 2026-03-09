import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
  const API_LOGIN_URL = '/jadwalin/api/login.php';
  const API_KELAS_URL = '/jadwalin/api/kelas.php';
  const API_UBAH_PASSWORD_URL = '/jadwalin/api/ubah_password.php';
  const API_USERS_URL = '/jadwalin/api/users.php';
  const API_GURU_URL = '/jadwalin/api/guru.php';
  const API_MAPEL_URL = '/jadwalin/api/mapel.php';

  const [user, setUser] = useState(null);

  // State UI & Modals
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = user?.role === 'admin';
  const [showManageUserModal, setShowManageUserModal] = useState(false);
  const [showManageKelasModal, setShowManageKelasModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [showGuruModal, setShowGuruModal] = useState(false);
  const [showMapelModal, setShowMapelModal] = useState(false);

  // State Data Master
  const [kelasList, setKelasList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [mapelList, setMapelList] = useState([]);

  // State Form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [kelasFormData, setKelasFormData] = useState({ id_kelas: '', tingkat: 'Kelas X', nama_kelas: '' });
  const [userFormData, setUserFormData] = useState({ id_user: '', username: '', password: '', nama_lengkap: '', id_kelas: '' });
  const [passData, setPassData] = useState({ password_baru: '', konfirmasi_password: '' });
  const [guruFormData, setGuruFormData] = useState({ id_guru: '', nama_guru: '' });
  const [mapelFormData, setMapelFormData] = useState({ id_mapel: '', nama_mapel: '' });

  // State Toggle Passwords
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showFormPass, setShowFormPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user_jadwalin');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchKelas();
    fetchGuru();
    fetchMapel();
  }, []);

  useEffect(() => { if (showManageUserModal && isAdmin) fetchUsers(); }, [showManageUserModal, isAdmin]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setShowDropdown(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => { const element = document.getElementById(id); if (element) element.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
      const element = document.getElementById(id); if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- FETCH DATA ---
  const fetchKelas = async () => { try { const res = await fetch(API_KELAS_URL); const json = await res.json(); if (json.success) setKelasList(json.data); } catch (e) { } };
  const fetchUsers = async () => { try { const res = await fetch(API_USERS_URL); const json = await res.json(); if (json.success) setUserList(json.data); } catch (e) { } };
  const fetchGuru = async () => { try { const res = await fetch(API_GURU_URL); const json = await res.json(); if (json.success) setGuruList(json.data); } catch (e) { } };
  const fetchMapel = async () => { try { const res = await fetch(API_MAPEL_URL); const json = await res.json(); if (json.success) setMapelList(json.data); } catch (e) { } };

  const groupedKelas = kelasList.reduce((acc, kls) => { if (!acc[kls.tingkat]) acc[kls.tingkat] = []; acc[kls.tingkat].push(kls); return acc; }, {});

  // --- CRUD GURU ---
  const handleSaveGuru = async () => {
    if (!guruFormData.nama_guru) return Swal.fire("Oops!", "Nama guru harus diisi!", "warning");
    const method = guruFormData.id_guru ? 'PUT' : 'POST';
    const url = guruFormData.id_guru ? `${API_GURU_URL}?id=${guruFormData.id_guru}` : API_GURU_URL;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(guruFormData) });
      const json = await res.json();
      if (json.success) { setGuruFormData({ id_guru: '', nama_guru: '' }); fetchGuru(); Swal.fire({ title: "Berhasil!", icon: "success", timer: 1000, showConfirmButton: false }); }
    } catch (e) { }
  };
  const handleDeleteGuru = (id) => {
    Swal.fire({ title: 'Hapus guru ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Hapus' }).then(async (res) => {
      if (res.isConfirmed) { await fetch(`${API_GURU_URL}?id=${id}`, { method: 'DELETE' }); fetchGuru(); }
    });
  };

  // --- CRUD MAPEL ---
  const handleSaveMapel = async () => {
    if (!mapelFormData.nama_mapel) return Swal.fire("Oops!", "Nama mapel harus diisi!", "warning");
    const method = mapelFormData.id_mapel ? 'PUT' : 'POST';
    const url = mapelFormData.id_mapel ? `${API_MAPEL_URL}?id=${mapelFormData.id_mapel}` : API_MAPEL_URL;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mapelFormData) });
      const json = await res.json();
      if (json.success) { setMapelFormData({ id_mapel: '', nama_mapel: '' }); fetchMapel(); Swal.fire({ title: "Berhasil!", icon: "success", timer: 1000, showConfirmButton: false }); }
    } catch (e) { }
  };
  const handleDeleteMapel = (id) => {
    Swal.fire({ title: 'Hapus mapel ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Hapus' }).then(async (res) => {
      if (res.isConfirmed) { await fetch(`${API_MAPEL_URL}?id=${id}`, { method: 'DELETE' }); fetchMapel(); }
    });
  };

  // --- CRUD USER & KELAS ---
  const handleUserInputChange = (e) => setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  const handleSaveUser = async (e) => { e.preventDefault(); if (!userFormData.username || !userFormData.nama_lengkap) return Swal.fire("Oops!", "Nama & Username wajib diisi!", "warning"); const method = userFormData.id_user ? 'PUT' : 'POST'; const url = userFormData.id_user ? `${API_USERS_URL}?id=${userFormData.id_user}` : API_USERS_URL; try { const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userFormData) }); const result = await response.json(); if (result.success) { Swal.fire({ title: "Berhasil!", icon: "success", timer: 1500, showConfirmButton: false }); setUserFormData({ id_user: '', username: '', password: '', nama_lengkap: '', id_kelas: '' }); fetchUsers(); } else { Swal.fire({ title: "Gagal!", text: result.message, icon: "error" }); } } catch (error) { } };
  const handleDeleteUser = async (id) => { Swal.fire({ title: 'Hapus akun?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!' }).then(async (result) => { if (result.isConfirmed) { await fetch(`${API_USERS_URL}?id=${id}`, { method: 'DELETE' }); fetchUsers(); } }); };
  const editUser = (u) => setUserFormData({ id_user: u.id_user, username: u.username, password: '', nama_lengkap: u.nama_lengkap, id_kelas: u.id_kelas || '' });

  const handleKelasInputChange = (e) => setKelasFormData({ ...kelasFormData, [e.target.name]: e.target.value });
  const handleSaveKelas = async (e) => { e.preventDefault(); const method = kelasFormData.id_kelas ? 'PUT' : 'POST'; const url = kelasFormData.id_kelas ? `${API_KELAS_URL}?id=${kelasFormData.id_kelas}` : API_KELAS_URL; try { const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kelasFormData) }); const result = await response.json(); if (result.success) { Swal.fire({ title: "Berhasil!", icon: "success", timer: 1500, showConfirmButton: false }); setKelasFormData({ id_kelas: '', tingkat: 'Kelas X', nama_kelas: '' }); fetchKelas(); } } catch (error) { } };
  const handleDeleteKelas = async (id) => { Swal.fire({ title: 'Hapus kelas ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!' }).then(async (result) => { if (result.isConfirmed) { await fetch(`${API_KELAS_URL}?id=${id}`, { method: 'DELETE' }); fetchKelas(); } }); };
  const editKelas = (kls) => setKelasFormData(kls);

  // --- AUTH ---
  const handlePassInputChange = (e) => setPassData({ ...passData, [e.target.name]: e.target.value });
  const submitUbahPassword = async (e) => { e.preventDefault(); if (!passData.password_baru || passData.password_baru !== passData.konfirmasi_password) return Swal.fire("Oops!", "Password tidak cocok!", "error"); try { const res = await fetch(API_UBAH_PASSWORD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_user: user.id_user, password_baru: passData.password_baru }) }); const json = await res.json(); if (json.success) { Swal.fire("Berhasil!", json.message, "success"); setShowChangePassModal(false); } } catch (e) { } };
  const handleLogin = async (e) => { e.preventDefault(); setIsLoggingIn(true); try { const res = await fetch(API_LOGIN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: loginUsername, password: loginPassword }) }); const json = await res.json(); if (json.success) { localStorage.setItem('user_jadwalin', JSON.stringify(json.data)); setUser(json.data); setShowAuthModal(false); window.location.reload(); } else { setLoginError(json.message); } } catch (e) { } setIsLoggingIn(false); };
  const handleLogout = () => { Swal.fire({ title: 'Yakin mau logout?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff4d4d', confirmButtonText: 'Logout!' }).then((result) => { if (result.isConfirmed) { localStorage.removeItem('user_jadwalin'); window.location.reload(); } }); };

  const EyeIcon = ({ isVisible }) => (isVisible ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo"><Link to="/">Jadwal!n</Link></div>

        <ul className="nav-links">
          <li><Link to="/tentang-kami">Tentang Kami</Link></li>
          <li className="nav-item-dropdown" ref={dropdownRef}>
            <span className="dropdown-trigger" onClick={() => setShowDropdown(!showDropdown)}>
              Layanan
              <svg className={`chevron ${showDropdown ? 'up' : 'down'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            {showDropdown && (
              <div className="dropdown-menu glass-dropdown">
                <a onClick={() => scrollToSection('info')} className="dropdown-item">Info Terkini</a>
                <a onClick={() => scrollToSection('agenda')} className="dropdown-item">Agenda Sekolah</a>
                <a onClick={() => scrollToSection('jadwal')} className="dropdown-item">Jadwal</a>
              </div>
            )}
          </li>
          <li><a href="https://www.smkn46jaktim.sch.id/" target="_blank" rel="noreferrer">Forensix</a></li>
        </ul>

        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user && (
            <>
              <button className="nav-icon-btn" onClick={() => setShowGuruModal(true)} title="Data Guru">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </button>
              <button className="nav-icon-btn" onClick={() => setShowMapelModal(true)} title="Data Mapel">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button className="nav-icon-btn" onClick={() => setShowManageKelasModal(true)} title="Kelola Kelas">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </button>
              <button className="nav-icon-btn" onClick={() => setShowManageUserModal(true)} title="Kelola Akun">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </button>
            </>
          )}

          {user && (
            <button className="nav-icon-btn" onClick={() => setShowChangePassModal(true)} title="Ubah Password">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            </button>
          )}

          {user ? (
            <button className="nav-icon-btn logout" onClick={handleLogout} title={`Logout (${user.username})`}>
              <svg viewBox="0 0 24 24" fill="#ff4d4d" width="18" height="18"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </button>
          ) : (
            <button className="nav-icon-login-naked" onClick={() => setShowAuthModal(true)} title="Login">
              <svg viewBox="0 0 24 24" fill="#ffffff" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.4c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
            </button>
          )}
        </div>
      </nav>

      {/* --- SEMUA MODAL --- */}

      {/* MODAL GURU */}
      {showGuruModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-md">
            <button className="close-btn" onClick={() => { setShowGuruModal(false); setGuruFormData({ id_guru: '', nama_guru: '' }); }}>&times;</button>
            <div className="form-container">
              <h3 className="modal-heading" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Data Guru</h3>
              {isAdmin && (
                <div className="form-inline-group">
                  <input 
                    type="text" 
                    placeholder="Nama Guru" 
                    value={guruFormData.nama_guru} 
                    onChange={(e) => setGuruFormData({ ...guruFormData, nama_guru: e.target.value })} 
                  />
                  
                  <button className="btn-tambah-inline" onClick={handleSaveGuru}>
                    {guruFormData.id_guru ? 'Update' : '+ Tambah'}
                  </button>

                  {guruFormData.id_guru && (
                    <button className="btn-batal-inline" onClick={() => setGuruFormData({ id_guru: '', nama_guru: '' })}>
                      Batal
                    </button>
                  )}
                </div>
              )}
              <div className="list-container-scroll">
                {guruList.map((g) => (
                  <div key={g.id_guru} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd', gap: '10px' }}>
                    <span style={{ flex: 1, textAlign: 'left', wordBreak: 'break-word', color: '#1e293b' }}><strong className="badge-id" style={{ color: '#555', marginRight: '5px' }}>ID: {g.id_guru}</strong> - {g.nama_guru}</span>
                    {isAdmin && (
                      <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button onClick={() => setGuruFormData(g)} className="btn-sm-edit">Edit</button>
                        <button onClick={() => handleDeleteGuru(g.id_guru)} className="btn-sm-delete">Hapus</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MAPEL */}
      {showMapelModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-md">
            <button className="close-btn" onClick={() => { setShowMapelModal(false); setMapelFormData({ id_mapel: '', nama_mapel: '' }); }}>&times;</button>
            <div className="form-container">
              <h3 className="modal-heading" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Data Mata Pelajaran</h3>
              {isAdmin && (
                <div className="form-inline-group">
                  <input 
                    type="text" 
                    placeholder="Nama Mapel" 
                    value={mapelFormData.nama_mapel} 
                    onChange={(e) => setMapelFormData({ ...mapelFormData, nama_mapel: e.target.value })} 
                  />
                  
                  <button className="btn-tambah-inline" onClick={handleSaveMapel}>
                    {mapelFormData.id_mapel ? 'Update' : '+ Tambah'}
                  </button>

                  {mapelFormData.id_mapel && (
                    <button className="btn-batal-inline" onClick={() => setMapelFormData({ id_mapel: '', nama_mapel: '' })}>
                      Batal
                    </button>
                  )}
                </div>
              )}
              <div className="list-container-scroll">
                {mapelList.map((m) => (
                  <div key={m.id_mapel} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd', gap: '10px' }}>
                    <span style={{ flex: 1, textAlign: 'left', wordBreak: 'break-word', color: '#1e293b' }}><strong className="badge-id" style={{ color: '#555', marginRight: '5px' }}>ID: {m.id_mapel}</strong> - {m.nama_mapel}</span>
                    {isAdmin && (
                      <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button onClick={() => setMapelFormData(m)} className="btn-sm-edit">Edit</button>
                        <button onClick={() => handleDeleteMapel(m.id_mapel)} className="btn-sm-delete">Hapus</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LOGIN & UBAH PASSWORD TETAP SAMA --- */}
      {showAuthModal && !user && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>&times;</button>
            <div className="form-container">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>LOGIN TO JADWAL!N</h3>
              {loginError && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{loginError}</p>}
              <input type="text" placeholder="USERNAME" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '10px' }} />
              <div className="input-with-icon" style={{ position: 'relative', marginBottom: '1rem' }}>
                <input 
                  type={showLoginPass ? "text" : "password"} 
                  placeholder="PASSWORD" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)} 
                  style={{ width: '100%', padding: '10px', paddingRight: '40px', marginBottom: 0 }} 
                />
                <span 
                  onClick={() => setShowLoginPass(!showLoginPass)} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                >
                  <EyeIcon isVisible={showLoginPass} />
                </span>
              </div>
              <button onClick={handleLogin} disabled={isLoggingIn} style={{ width: '100%', padding: '12px', background: '#0F4C92', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{isLoggingIn ? 'LOADING...' : 'LOGIN'}</button>
            </div>
          </div>
        </div>
      )}

      {showChangePassModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => { setShowChangePassModal(false); setPassData({ password_baru: '', konfirmasi_password: '' }); }}>&times;</button>
            <div className="form-container">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>UBAH PASSWORD</h3>
              <div className="input-with-icon" style={{ position: 'relative', marginBottom: '1rem' }}>
                <input 
                  type={showNewPass ? "text" : "password"} 
                  name="password_baru" 
                  value={passData.password_baru} 
                  onChange={handlePassInputChange} 
                  placeholder="PASSWORD BARU" 
                  style={{ width: '100%', padding: '10px', paddingRight: '40px', marginBottom: 0 }} 
                />
                <span 
                  onClick={() => setShowNewPass(!showNewPass)} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                >
                  <EyeIcon isVisible={showNewPass} />
                </span>
              </div>
              
              <div className="input-with-icon" style={{ position: 'relative', marginBottom: '1rem' }}>
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  name="konfirmasi_password" 
                  value={passData.konfirmasi_password} 
                  onChange={handlePassInputChange} 
                  placeholder="KONFIRMASI PASSWORD" 
                  style={{ width: '100%', padding: '10px', paddingRight: '40px', marginBottom: 0 }} 
                />
                <span 
                  onClick={() => setShowConfirmPass(!showConfirmPass)} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                >
                  <EyeIcon isVisible={showConfirmPass} />
                </span>
              </div>
              <button onClick={submitUbahPassword} style={{ width: '100%', padding: '12px', background: '#0F4C92', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>UPDATE PASSWORD</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KELOLA AKUN --- */}
      {showManageUserModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-md">
            <button className="close-btn" onClick={() => { setShowManageUserModal(false); setUserFormData({ id_user: '', username: '', password: '', nama_lengkap: '', id_kelas: '' }); }}>&times;</button>
            <div className="form-container">
              <h3 className="modal-heading-main" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{userFormData.id_user ? 'Edit Data Pengurus' : 'Tambah Ketua Kelas'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                <input type="text" name="nama_lengkap" value={userFormData.nama_lengkap} onChange={handleUserInputChange} placeholder="Nama Lengkap" style={{ padding: '10px', color: '#1e293b', border: '1px solid #ccc', borderRadius: '4px' }} />
                <select name="id_kelas" value={userFormData.id_kelas} onChange={handleUserInputChange} style={{ padding: '10px', color: '#1e293b', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="">-- Pilih Kelas --</option>
                  {Object.entries(groupedKelas).map(([tingkat, klsArr]) => (
                    <optgroup label={tingkat} key={tingkat}>
                      {klsArr.map((kls) => <option key={kls.id_kelas} value={kls.id_kelas}>{kls.nama_kelas}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input type="text" name="username" value={userFormData.username} onChange={handleUserInputChange} placeholder="Username" style={{ padding: '10px', color: '#1e293b', border: '1px solid #ccc', borderRadius: '4px' }} />
                <div style={{ position: 'relative' }}>
                  <input type={showFormPass ? "text" : "password"} name="password" value={userFormData.password} onChange={handleUserInputChange} placeholder={userFormData.id_user ? "Ketik untuk ganti password (Opsional)" : "Password Awal"} style={{ width: '100%', padding: '10px', paddingRight: '40px', color: '#1e293b', border: '1px solid #ccc', borderRadius: '4px' }} />
                  <span onClick={() => setShowFormPass(!showFormPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666' }}><EyeIcon isVisible={showFormPass} /></span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={handleSaveUser} style={{ flex: 1, padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{userFormData.id_user ? 'Update Akun' : 'Buat Akun'}</button>
                  {userFormData.id_user && <button onClick={() => setUserFormData({ id_user: '', username: '', password: '', nama_lengkap: '', id_kelas: '' })} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Batal</button>}
                </div>
              </div>
              <div className="list-container-scroll-bordered" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                {userList.map((u) => (
                  <div key={u.id_user} className="list-item-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px', gap: '10px' }}>
                    <div className="user-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                      <strong className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1e293b' }}>{u.nama_lengkap} <span className="user-username" style={{ color: '#666', fontWeight: 'normal' }}>({u.username})</span></strong>
                      <span className="user-class" style={{ fontSize: '0.85rem', color: '#888' }}>{u.nama_kelas || 'Tanpa Kelas'}</span>
                    </div>
                    <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                      <button onClick={() => editUser(u)} className="btn-sm-edit">Edit</button>
                      <button onClick={() => handleDeleteUser(u.id_user)} className="btn-sm-delete">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KELOLA KELAS --- */}
      {showManageKelasModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-md">
            <button className="close-btn" onClick={() => { setShowManageKelasModal(false); setKelasFormData({ id_kelas: '', tingkat: 'Kelas X', nama_kelas: '' }); }}>&times;</button>
            <div className="form-container">
              <h3 className="modal-heading" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Kelola Data Kelas</h3>
              
              {/* FIX TOTAL: Dropdown, Input, Button dijejerin 1 baris, copot semua class CSS biar anti ngeyel */}
              {/* FORM KELOLA KELAS */}
              <div className="form-inline-group">
                <select name="tingkat" value={kelasFormData.tingkat} onChange={handleKelasInputChange}>
                  <option value="Kelas X">Kelas X</option>
                  <option value="Kelas XI">Kelas XI</option>
                  <option value="Kelas XII">Kelas XII</option>
                </select>

                <input 
                  type="text" 
                  name="nama_kelas" 
                  value={kelasFormData.nama_kelas} 
                  onChange={handleKelasInputChange} 
                  placeholder="Nama Kelas" 
                />

                <button className="btn-tambah-inline" onClick={handleSaveKelas}>
                  {kelasFormData.id_kelas ? 'Update' : '+ Tambah'}
                </button>

                {kelasFormData.id_kelas && (
                  <button className="btn-batal-inline" onClick={() => setKelasFormData({ id_kelas: '', tingkat: 'Kelas X', nama_kelas: '' })}>
                    Batal
                  </button>
                )}
              </div>

              <div className="list-container-scroll-bordered" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                {Object.entries(groupedKelas).map(([tingkat, klsArr]) => (
                  <div key={tingkat} className="class-group" style={{ marginBottom: '15px' }}>
                    <strong className="class-group-title" style={{ display: 'block', background: '#f5f5f5', padding: '5px', marginBottom: '5px', textAlign: 'left', color: '#475569' }}>{tingkat}</strong>
                    {klsArr.map((kls) => (
                      <div key={kls.id_kelas} className="list-item-flex-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderBottom: '1px solid #eee', gap: '10px' }}>
                        <span className="class-name" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', color: '#1e293b' }}>{kls.nama_kelas}</span>
                        <div className="action-buttons" style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                          <button onClick={() => editKelas(kls)} className="btn-sm-edit">Edit</button>
                          <button onClick={() => handleDeleteKelas(kls.id_kelas)} className="btn-sm-delete">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;