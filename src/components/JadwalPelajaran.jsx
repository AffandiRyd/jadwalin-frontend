import React, { useState, useEffect } from 'react';

const JadwalKelas = () => {
  // GANTI INI SESUAI URL BACKEND PHP LU!
  const API_URL = 'http://localhost/jadwalin/api/jadwal'; 
  
  // Mode Tamu (belum ada yang login)
  const [user, setUser] = useState(null);
  const canEditJadwal = user?.role === 'pengurus';

  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk filter dropdown kelas (Khusus tamu/admin)
  const [filterKelas, setFilterKelas] = useState('');

  // State BARU untuk Filter Hari (Default: Senin)
  const [activeDay, setActiveDay] = useState('Senin');
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']; // Daftar hari sekolah

  // State buat Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ 
    id_jadwal: '', 
    id_mapel: '', 
    id_guru: '', 
    hari: 'Senin', 
    jam_mulai: '', 
    jam_selesai: '', 
    ruangan: '' 
  });

  // --- MENGAMBIL DATA DARI BACKEND (GET) ---
  const fetchJadwal = async () => {
    setLoading(true);
    try {
      let url = API_URL;
      if (user?.role === 'pengurus') {
        url = `${API_URL}?id_kelas=${user.id_kelas}`;
      } else if (filterKelas !== '') {
        url = `${API_URL}?id_kelas=${filterKelas}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) setJadwalList(result.data);
    } catch (error) {
      console.error("Gagal narik data jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [filterKelas]);

  // --- BUKA/TUTUP MODAL ---
  const openModal = (type, jadwalData = null) => {
    setModalType(type);
    if (type === 'edit' && jadwalData) {
      setFormData(jadwalData);
    } else {
      // Set default hari ke activeDay pas nambah jadwal baru
      setFormData({ id_jadwal: '', id_mapel: '', id_guru: '', hari: activeDay, jam_mulai: '', jam_selesai: '', ruangan: '' });
    }
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SIMPAN & HAPUS DATA ---
  const handleSave = async () => {
    const url = modalType === 'edit' ? `${API_URL}/${formData.id_jadwal}` : API_URL;
    const method = modalType === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        closeModal();
        fetchJadwal();
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Yakin mau hapus jadwal ini?")) return;

    try {
      const response = await fetch(`${API_URL}/${formData.id_jadwal}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        alert("Jadwal berhasil dihapus!");
        closeModal();
        fetchJadwal();
      } else {
         alert("Gagal hapus: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Logika Filter: Cuma tampilin jadwal yang harinya sama dengan activeDay
  const displayedJadwal = jadwalList.filter(jadwal => jadwal.hari === activeDay);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span>📚</span>
          <h2>Jadwal Pelajaran {user?.role === 'pengurus' ? `Kelas Anda` : ''}</h2>
        </div>
        
        {canEditJadwal && (
          <button onClick={() => openModal('add')} title="Tambah Jadwal" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      {/* DROPDOWN FILTER KELAS (Hanya Muncul untuk Tamu & Admin) */}
      {user?.role !== 'pengurus' && (
        <div style={{ marginBottom: '15px' }}>
          <select 
            value={filterKelas} 
            onChange={(e) => setFilterKelas(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '200px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">-- Tampilkan Semua Kelas --</option>
            <option value="1">Kelas X RPL 1</option>
            <option value="2">Kelas X RPL 2</option>
            <option value="3">Kelas XI RPL 1</option>
          </select>
        </div>
      )}

      {/* BUTTON FILTER HARI (Senin, Selasa, dll) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              // Kalau aktif warnanya hijau, kalau nggak abu-abu
              backgroundColor: activeDay === day ? '#10b981' : '#f3f4f6',
              color: activeDay === day ? 'white' : '#666',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {loading ? <p>Memuat jadwal...</p> : (
        <div className="grid-container">
          {displayedJadwal.length > 0 ? (
            // Map dari displayedJadwal (yang udah difilter per hari), BUKAN jadwalList
            displayedJadwal.map((jadwal) => (
              <div key={jadwal.id_jadwal} className="custom-card card-jadwal" style={{ position: 'relative', borderLeft: '4px solid #10b981' }}>
                
                {(canEditJadwal && (!jadwal.id_kelas || jadwal.id_kelas === user.id_kelas)) && (
                  <button onClick={() => openModal('edit', jadwal)} title="Edit Jadwal" style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                )}

                <div className="badge-jadwal" style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {jadwal.jam_mulai} - {jadwal.jam_selesai} {/* Hari udah gak perlu ditulis lagi di sini karena udah jelas dari tab */}
                </div>
                <h3 className="card-title">{jadwal.nama_mapel || `Mapel ID: ${jadwal.id_mapel}`}</h3>
                <p className="card-desc">Guru: {jadwal.nama_guru || `Guru ID: ${jadwal.id_guru}`}</p>
                <p className="card-desc" style={{ fontSize: '12px', marginTop: '5px' }}>Ruangan: {jadwal.ruangan}</p>
                
                {(!filterKelas && user?.role !== 'pengurus') && (
                  <p className="card-desc" style={{ fontSize: '12px', marginTop: '5px', fontWeight: 'bold' }}>
                    Kelas: {jadwal.nama_kelas || `ID Kelas: ${jadwal.id_kelas}`}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Tidak ada jadwal untuk hari {activeDay}.</p>
          )}
        </div>
      )}

      {/* POPUP MODAL FORM JADWAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              {modalType === 'edit' ? 'Edit Jadwal' : 'Tambah Jadwal'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Hari</label>
              <select name="hari" value={formData.hari} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Jam Mulai</label>
                <input type="time" name="jam_mulai" value={formData.jam_mulai} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Jam Selesai</label>
                <input type="time" name="jam_selesai" value={formData.jam_selesai} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>ID Mata Pelajaran</label>
              <input type="number" name="id_mapel" value={formData.id_mapel} onChange={handleInputChange} placeholder="Masukkan ID Mapel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>ID Guru</label>
              <input type="number" name="id_guru" value={formData.id_guru} onChange={handleInputChange} placeholder="Masukkan ID Guru" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Ruangan</label>
              <input type="text" name="ruangan" value={formData.ruangan} onChange={handleInputChange} placeholder="Contoh: Lab Komputer 1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSave} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
              Simpan
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              {modalType === 'edit' && (
                <button onClick={handleDelete} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Hapus</button>
              )}
              <button onClick={closeModal} style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default JadwalKelas;