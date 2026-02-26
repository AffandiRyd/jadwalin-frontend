import React, { useState, useEffect } from 'react';

const AgendaSekolah = () => {
  // GANTI INI SESUAI URL BACKEND PHP LU!
  const API_URL = 'http://localhost/jadwalin/api/agenda'; 
  
  // Mode Tamu (belum ada yang login)
  const [user, setUser] = useState(null);
  const canEditAgenda = user?.role === 'admin';

  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State buat Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ id: '', judul: '', isi: '', tanggal: '' });

  // --- MENGAMBIL DATA DARI BACKEND (GET) ---
  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setAgendaList(result.data);
    } catch (error) {
      console.error("Gagal narik data agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  // --- BUKA/TUTUP MODAL ---
  const openModal = (type, agendaData = null) => {
    setModalType(type);
    if (type === 'edit' && agendaData) {
      setFormData(agendaData);
    } else {
      setFormData({ id: '', judul: '', isi: '', tanggal: '' });
    }
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // --- HANDLE PERUBAHAN INPUT FORM ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SIMPAN DATA (POST / PUT) ---
  const handleSave = async () => {
    const url = modalType === 'edit' ? `${API_URL}/${formData.id}` : API_URL;
    const method = modalType === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        closeModal();
        fetchAgenda(); // Refresh data
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // --- HAPUS DATA (DELETE) ---
  const handleDelete = async () => {
    if (!window.confirm("Yakin mau hapus agenda ini?")) return;

    try {
      const response = await fetch(`${API_URL}/${formData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        alert("Agenda berhasil dihapus!");
        closeModal();
        fetchAgenda();
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span>🗓️</span>
          <h2>Agenda Sekolah</h2>
        </div>
        {canEditAgenda && (
          <button onClick={() => openModal('add')} title="Tambah Agenda" style={{ backgroundColor: '#3b4cca', color: 'white', border: 'none', borderRadius: '8px', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      {loading ? <p>Memuat agenda sekolah...</p> : (
        <div className="grid-container">
          {agendaList.length > 0 ? (
            agendaList.map((agenda) => (
              <div key={agenda.id} className="custom-card card-agenda" style={{ position: 'relative' }}>
                {canEditAgenda && (
                  <button onClick={() => openModal('edit', agenda)} title="Edit Agenda" style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                )}
                <div className="badge-agenda">{agenda.tanggal}</div>
                <h3 className="card-title">{agenda.judul}</h3>
                <p className="card-desc">{agenda.isi}</p>
              </div>
            ))
          ) : <p>Belum ada agenda.</p>}
        </div>
      )}

      {/* POPUP MODAL FORM */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              {modalType === 'edit' ? 'Edit Agenda' : 'Tambah Agenda'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Tanggal</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} placeholder="Nama Kegiatan" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <textarea name="isi" value={formData.isi} onChange={handleInputChange} placeholder="Deskripsi Kegiatan" rows="4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>

            <button onClick={handleSave} style={{ width: '100%', padding: '12px', backgroundColor: '#3b4cca', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
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

export default AgendaSekolah;