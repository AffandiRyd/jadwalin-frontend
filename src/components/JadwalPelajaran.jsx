import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const JadwalKelas = () => {
  const API_URL = 'http://localhost/jadwalin/api/jadwal.php'; 
  const API_KELAS_URL = 'http://localhost/jadwalin/api/kelas.php';
  const API_GURU_URL = 'http://localhost/jadwalin/api/guru.php'; 
  const API_MAPEL_URL = 'http://localhost/jadwalin/api/mapel.php'; 

  const [user, setUser] = useState(null);
  const canEditJadwal = user?.role === 'pengurus';

  const [jadwalList, setJadwalList] = useState([]);
  const [kelasList, setKelasList] = useState([]); 
  const [guruList, setGuruList] = useState([]); 
  const [mapelList, setMapelList] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filterKelas, setFilterKelas] = useState('');

  const [activeDay, setActiveDay] = useState('Senin');
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ 
    id_jadwal: '', id_mapel: '', id_guru: '', hari: 'Senin', jam_mulai: '', jam_selesai: '', ruangan: '' 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_jadwalin');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    fetchKelas();
    fetchGuru(); 
    fetchMapel(); 
  }, []);

  const fetchKelas = async () => {
    try {
      const response = await fetch(API_KELAS_URL);
      const result = await response.json();
      if (result.success) setKelasList(result.data);
    } catch (error) {
      console.error("Gagal menarik data kelas", error);
    }
  };

  const fetchGuru = async () => {
    try {
      const response = await fetch(API_GURU_URL);
      const result = await response.json();
      if (result.success) setGuruList(result.data); 
      else if (Array.isArray(result)) setGuruList(result);
    } catch (error) {
      console.error("Gagal menarik data guru", error);
    }
  };

  const fetchMapel = async () => {
    try {
      const response = await fetch(API_MAPEL_URL);
      const result = await response.json();
      if (result.success) setMapelList(result.data); 
      else if (Array.isArray(result)) setMapelList(result);
    } catch (error) {
      console.error("Gagal menarik data mapel", error);
    }
  };

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      let url = API_URL;
      const currentUser = JSON.parse(localStorage.getItem('user_jadwalin'));

      if (currentUser?.role === 'pengurus') {
        url = `${API_URL}?id_kelas=${currentUser.id_kelas}`;
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

  const groupedKelas = kelasList.reduce((acc, kls) => {
    if (!acc[kls.tingkat]) acc[kls.tingkat] = [];
    acc[kls.tingkat].push(kls);
    return acc;
  }, {});

  const openModal = (type, jadwalData = null) => {
    setModalType(type);
    if (type === 'edit' && jadwalData) setFormData(jadwalData);
    else setFormData({ id_jadwal: '', id_mapel: '', id_guru: '', hari: activeDay, jam_mulai: '', jam_selesai: '', ruangan: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSaving(false);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // --- TAMBAHAN VALIDASI FRONTEND ---
    if (!formData.id_mapel || !formData.id_guru) {
      Swal.fire({ title: "Peringatan!", text: "Mata Pelajaran dan Guru pengajar wajib dipilih!", icon: "warning" });
      return; // Stop eksekusi, jangan lanjut nge-hit API
    }

    if (!user?.id_kelas) {
      Swal.fire({ 
        title: "Error Kelas!", 
        text: "Akun ini tidak memiliki ID Kelas. Coba logout dan login kembali.", 
        icon: "error" 
      });
      return; // Stop eksekusi
    }
    // ----------------------------------

    setIsSaving(true);
    const url = modalType === 'edit' ? `${API_URL}?id=${formData.id_jadwal}` : API_URL;
    const method = modalType === 'edit' ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      id_kelas: user?.id_kelas 
    };

    // Buat ngecek di inspect element (console) apa data yang beneran dikirim
    console.log("Data Payload yang dikirim ke PHP:", payload); 

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token || ''}` },
        body: JSON.stringify(payload) 
      });
      const result = await response.json();
      
      if (result.success) {
        closeModal(); 
        Swal.fire({ title: "Berhasil!", text: result.message, icon: "success", timer: 1500, showConfirmButton: false });
        fetchJadwal();
      } else {
        Swal.fire({ title: "Gagal!", text: result.message, icon: "error" });
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: "Koneksi ke server gagal.", icon: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Yakin mau hapus jadwal?',
      text: "Jadwal ini bakal ilang dari daftar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#888',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}?id=${formData.id_jadwal}&id_kelas=${user?.id_kelas}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${user?.token || ''}` }
          });
          const resJson = await response.json();
          if (resJson.success) {
            closeModal();
            Swal.fire({ title: "Terhapus!", text: "Jadwal berhasil dihapus.", icon: "success", timer: 1500, showConfirmButton: false });
            fetchJadwal();
          } else {
            Swal.fire({ title: "Gagal!", text: resJson.message, icon: "error" });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  };

  const displayedJadwal = jadwalList.filter(jadwal => jadwal.hari === activeDay);

  return (
    <section id="jadwal">
      <div className="header-actions">
        <div className="section-header">
          <span>📚</span>
          <h2>Jadwal Pelajaran {user?.role === 'pengurus' ? `Kelas Anda` : ''}</h2>
        </div>
        
        {canEditJadwal && (
          <button onClick={() => openModal('add')} title="Tambah Jadwal" className="btn-icon success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      {/* PERUBAHAN 1: Ganti select-filter jadi custom-select biar styling putihnya masuk */}
      {user?.role !== 'pengurus' && (
        <div className="filter-container">
          <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="custom-select">
            <option value="">-- Tampilkan Semua Kelas --</option>
            {Object.entries(groupedKelas).map(([tingkat, klsArr]) => (
              <optgroup label={tingkat} key={tingkat} className="optgroup-label">
                {klsArr.map((kls) => (
                  <option key={kls.id_kelas} value={kls.id_kelas} className="option-item">{kls.nama_kelas}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {/* PERUBAHAN 2: Ganti day-tabs jadi days-container, btn-day-tab jadi btn-day active/inactive */}
      <div className="days-container">
        {days.map((day) => (
          <button 
            key={day} 
            onClick={() => setActiveDay(day)} 
            className={`btn-day ${activeDay === day ? 'active' : 'inactive'}`}
          >
            {day}
          </button>
        ))}
      </div>

      {loading ? <p className="empty-state">Memuat jadwal...</p> : (
        <div className="grid-container">
          {displayedJadwal.length > 0 ? (
            displayedJadwal.map((jadwal) => (
              <div key={jadwal.id_jadwal} className="custom-card card-jadwal">
                {(canEditJadwal && (!jadwal.id_kelas || String(jadwal.id_kelas) === String(user.id_kelas))) && (
                  <button onClick={() => openModal('edit', jadwal)} title="Edit Jadwal" className="btn-icon-edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                )}
                <div className="badge-jadwal">{jadwal.jam_mulai} - {jadwal.jam_selesai}</div>
                <h3 className="card-title">{jadwal.nama_mapel || `Mapel ID: ${jadwal.id_mapel}`}</h3>
                
                {/* PERUBAHAN 3: Tambah icon guru dan pake class guru-text biar nempel di bawah */}
                <p className="guru-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  {jadwal.nama_guru || `Guru ID: ${jadwal.id_guru}`}
                </p>
                <p className="card-desc">Ruangan: {jadwal.ruangan}</p>
                
                {(!filterKelas && user?.role !== 'pengurus') && (
                  <p className="card-desc bold">Kelas: {jadwal.nama_kelas || `ID Kelas: ${jadwal.id_kelas}`}</p>
                )}
              </div>
            ))
          ) : (
            <p className="empty-state">Tidak ada jadwal untuk hari {activeDay}.</p>
          )}
        </div>
      )}

      {/* ================= MODAL TAMBAH / EDIT ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-md pop-up-animation">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h3 className="modal-heading-main">{modalType === 'edit' ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
            
            <div className="form-column">
              
              {/* Pilihan Mata Pelajaran */}
              <div className="form-group">
                <label className="input-label">Mata Pelajaran</label>
                <select name="id_mapel" value={formData.id_mapel} onChange={handleInputChange} className="select-field">
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {mapelList.map(mapel => (
                    <option key={mapel.id_mapel} value={mapel.id_mapel}>{mapel.nama_mapel}</option>
                  ))}
                </select>
              </div>

              {/* Pilihan Guru */}
              <div className="form-group">
                <label className="input-label">Guru Pengajar</label>
                <select name="id_guru" value={formData.id_guru} onChange={handleInputChange} className="select-field">
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(guru => (
                    <option key={guru.id_guru} value={guru.id_guru}>{guru.nama_guru}</option>
                  ))}
                </select>
              </div>

              {/* Pilihan Hari */}
              <div className="form-group">
                <label className="input-label">Hari</label>
                <select name="hari" value={formData.hari} onChange={handleInputChange} className="select-field">
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Jam Mulai & Selesai sejajar */}
              <div className="form-group">
                <label className="input-label">Jam Pelajaran</label>
                <div className="form-row-inline">
                  <input 
                    type="time" 
                    name="jam_mulai" 
                    value={formData.jam_mulai} 
                    onChange={handleInputChange} 
                    className="input-field-flex" 
                    required 
                  />
                  <span style={{color: '#64748b', fontWeight: 'bold'}}>-</span>
                  <input 
                    type="time" 
                    name="jam_selesai" 
                    value={formData.jam_selesai} 
                    onChange={handleInputChange} 
                    className="input-field-flex" 
                    required 
                  />
                </div>
              </div>

              {/* Ruangan */}
              <div className="form-group">
                <label className="input-label">Ruangan</label>
                <input 
                  type="text" 
                  name="ruangan" 
                  placeholder="Contoh: R. Teori 1" 
                  value={formData.ruangan} 
                  onChange={handleInputChange} 
                  className="input-field" 
                />
              </div>

            </div>

            <div className="form-action-row">
              <button onClick={handleSave} className="btn-success-full" disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
              {modalType === 'edit' && (
                <button onClick={handleDelete} className="btn-sm-delete">Hapus</button>
              )}
              <button onClick={closeModal} className="btn-cancel-full">Batal</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default JadwalKelas;