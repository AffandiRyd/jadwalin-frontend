import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 

const InfoTerkini = () => {
  const API_URL = 'http://localhost/jadwalin/api/info'; 
  
  const [user, setUser] = useState(null);
  const canEditInfo = user?.role === 'admin';

  const [infoList, setInfoList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ id_pengumuman: '', judul: '', isi: '', tanggal: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_jadwalin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) setInfoList(result.data);
    } catch (error) {
      console.error("Gagal narik data info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const openModal = (type, infoData = null) => {
    setModalType(type);
    if (type === 'edit' && infoData) {
      setFormData(infoData);
    } else {
      setFormData({ id_pengumuman: '', judul: '', isi: '', tanggal: '' });
    }
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const url = modalType === 'edit' ? `${API_URL}/${formData.id_pengumuman}` : API_URL;
    const method = modalType === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.success) {
        Swal.fire({ title: "Berhasil!", text: result.message, icon: "success", timer: 1500, showConfirmButton: false });
        closeModal();
        fetchInfo(); 
      } else {
        Swal.fire({ title: "Gagal!", text: result.message, icon: "error", confirmButtonText: "Sip" });
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Yakin mau hapus?',
      text: "Data pengumuman ini gak bisa dibalikin lho!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#888',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/${formData.id_pengumuman}`, {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${user?.token || ''}` 
            }
          });
          const resJson = await response.json();
          
          if (resJson.success) {
            Swal.fire({ title: "Terhapus!", text: "Info berhasil dihapus.", icon: "success", timer: 1500, showConfirmButton: false });
            closeModal();
            fetchInfo(); 
          }
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    });
  };

  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggalString).toLocaleDateString('id-ID', options);
  };

  return (
    <section id="info">
      <div className="header-actions">
        <div className="section-header">
          <span>📢</span>
          <h2>Info Terkini</h2>
        </div>
        {canEditInfo && (
          <button onClick={() => openModal('add')} title="Tambah Info" className="btn-icon primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      {loading ? <p className="empty-state">Memuat info terkini...</p> : (
        <div className="grid-container">
          {infoList.length > 0 ? (
            infoList.map((info) => (
              <div key={info.id_pengumuman} className="custom-card card-info">
                {canEditInfo && (
                  <button onClick={() => openModal('edit', info)} title="Edit Info" className="btn-icon-edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                )}
                <div className="badge-info">{formatTanggal(info.tanggal)}</div>
                <h3 className="card-title">{info.judul}</h3>
                <p className="card-desc">{info.isi}</p>
              </div>
            ))
          ) : <p className="empty-state">Belum ada pengumuman.</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {modalType === 'edit' ? 'Edit Info' : 'Tambah Info'}
            </h3>
            
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="input-field" />
            </div>
            
            <div className="form-group">
              <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} placeholder="Judul Pengumuman" className="input-field" />
            </div>
            
            <div className="form-group">
              <textarea name="isi" value={formData.isi} onChange={handleInputChange} placeholder="Isi Pengumuman" rows="4" className="input-field textarea-field"></textarea>
            </div>

            <button onClick={handleSave} className="btn-primary">
              Simpan
            </button>
            
            <div className="modal-actions">
              {modalType === 'edit' && (
                <button onClick={handleDelete} className="btn-danger">Hapus</button>
              )}
              <button onClick={closeModal} className="btn-secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InfoTerkini;