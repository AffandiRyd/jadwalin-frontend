import React from 'react';
import InfoTerkini from './InfoTerkini';
import AgendaSekolah from './AgendaSekolah';

const MainContent = () => {
  return (
    <div className="content-container" style={{ paddingBottom: '50px' }}>
      
      {/* HEADER UTAMA SEKARANG ADA DI SINI (Di luar Info dan Agenda) */}
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#000', marginBottom: '4px' }}>
          Halo, Peserta Didik!!
        </h1>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
          Selamat datang di Jadwal!n, website yang dapat membantu peserta didik SMKN 46 Jakarta.
        </p>
      </header>

      {/* Panggil komponen Info */}
      <InfoTerkini />

      {/* Panggil komponen Agenda */}
      <AgendaSekolah />

    </div>
  );
};

export default MainContent;