import React from 'react';
import InfoTerkini from './InfoTerkini';
import AgendaSekolah from './AgendaSekolah';

const MainContent = () => {
  return (
    <div className="content-container">
      
      {/* 1. BAGIAN SAMBUTAN */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Halo, Peserta Didik!!
        </h1>
        <p className="welcome-subtitle">
          Selamat datang di Jadwal!n, website yang dapat membantu peserta didik SMKN 46 Jakarta.
        </p>
      </div>

      {/* Komponen InfoTerkini dan AgendaSekolah sepertinya bakal dipanggil di sini nantinya */}
    </div>
  );
};

export default MainContent;