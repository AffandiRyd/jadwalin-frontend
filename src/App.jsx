import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfoTerkini from './components/InfoTerkini';
import AgendaSekolah from './components/AgendaSekolah';
import JadwalPelajaran from './components/JadwalPelajaran';
import TentangKami from './components/TentangKami';
import Footer from './components/Footer';
import './App.css'; // Pastikan import CSS lu

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div className="page-wrapper">
            <Hero />
            <div className="content-container">
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