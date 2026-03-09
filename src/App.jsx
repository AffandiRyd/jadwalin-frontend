import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import InfoTerkini from './components/InfoTerkini';
import AgendaSekolah from './components/AgendaSekolah';
import JadwalPelajaran from './components/JadwalPelajaran';
import TentangKami from './components/TentangKami';
import Footer from './components/Footer';
import './App.css'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          /* 1. TAMBAHIN student-dashboard DI SINI SEBAGAI PAGAR */
          <div className="page-wrapper student-dashboard">
            <Hero />
            
            <div className="content-container">
              {/* 2. PINDAHIN MainContent KE DALAM SINI BIAR RAPET & SEJAJAR */}
              <MainContent /> 
              <section id="info"><InfoTerkini /></section>
              <section id="agenda"><AgendaSekolah /></section>
              <section id="jadwal"><JadwalPelajaran /></section>
            </div>
            
            <Footer />
          </div>
        } />
        <Route path="/info" element={<InfoTerkini />} />
        <Route path="/agenda" element={<AgendaSekolah />} />
        <Route path="/jadwal" element={<JadwalPelajaran />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
      </Routes>
    </Router>
  );
}

export default App;