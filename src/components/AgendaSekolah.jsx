import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 

const AgendaSekolah = () => {
  const API_URL = '/jadwalin/api/agenda.php'; 
  
  const [user, setUser] = useState(null);
  const canEditAgenda = user?.role === 'admin';

  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  // PERBAIKAN: Ganti id_agenda jadi id
  const [formData, setFormData] = useState({ id: '', judul: '', isi: '', tanggal: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_jadwalin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchAgenda();
  }, []);

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

  const openModal = (type, agendaData = null) => {
    setModalType(type);
    if (type === 'edit' && agendaData) {
      setFormData(agendaData);
    } else {
      // PERBAIKAN: Ganti id_agenda jadi id
      setFormData({ id: '', judul: '', isi: '', tanggal: '' });
    }
    setShowModal(true);
  };
  
  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const method = modalType === 'edit' ? 'PUT' : 'POST';
    // PERBAIKAN: Panggil formData.id bukan id_agenda
    const url = modalType === 'edit' ? `${API_URL}?id=${formData.id}` : API_URL;

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
        fetchAgenda(); 
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
      text: "Data agenda ini bakal lenyap lho!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#888',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // PERBAIKAN: Panggil formData.id bukan id_agenda
          const response = await fetch(`${API_URL}?id=${formData.id}`, {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token || ''}` 
            }
          });
          const resJson = await response.json();
          
          if (resJson.success) {
            Swal.fire({ title: "Terhapus!", text: "Agenda berhasil dihapus.", icon: "success", timer: 1500, showConfirmButton: false });
            closeModal();
            fetchAgenda();
          } else {
            Swal.fire({ title: "Gagal!", text: resJson.message, icon: "error" });
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
    <section id="agenda">
      <div className="header-actions">
        <div className="section-header">
          <span>🗓️</span>
          <h2>Agenda Sekolah</h2>
        </div>
        {canEditAgenda && (
          <button onClick={() => openModal('add')} title="Tambah Agenda" className="btn-icon primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      {loading ? <p className="empty-state">Memuat agenda sekolah...</p> : (
        <div className="grid-container">
          {agendaList.length > 0 ? (
            agendaList.map((agenda) => (
              // PERBAIKAN: Key diganti jadi agenda.id
              <div key={agenda.id} className="custom-card card-agenda">
                {canEditAgenda && (
                  <button onClick={() => openModal('edit', agenda)} title="Edit Agenda" className="btn-icon-edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                )}
                <div className="badge-agenda">{formatTanggal(agenda.tanggal)}</div>
                <h3 className="card-title">{agenda.judul}</h3>
                <p className="card-desc">{agenda.isi}</p>
              </div>
            ))
          ) : <p className="empty-state">Belum ada agenda.</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {modalType === 'edit' ? 'Edit Agenda' : 'Tambah Agenda'}
            </h3>
            
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="input-field" />
            </div>
            
            <div className="form-group">
              <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} placeholder="Nama Kegiatan" className="input-field" />
            </div>
            
            <div className="form-group">
              <textarea name="isi" value={formData.isi} onChange={handleInputChange} placeholder="Deskripsi Kegiatan" rows="4" className="input-field textarea-field"></textarea>
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

export default AgendaSekolah;