import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container" style={{ backgroundImage: 'url("/images/sekolah-bg.jpg")' }}>
      <div className="footer-overlay"></div>
      
      <div className="footer-content">
        <div className="footer-top-brand">
          <img src="/images/logo.png" alt="Logo SMK" className="footer-logo" />
          <div className="brand-text">
            <h4>SMK NEGERI 46 JAKARTA</h4>
            <p>Satukan Hati, Lejitkan Prestasi.</p>
          </div>
        </div>

        <div className="footer-info">
          {/* 1. ALAMAT (Langsung buka Google Maps SMKN 46 Jakarta) */}
          <a href="https://maps.google.com/?q=SMKN+46+Jakarta" target="_blank" rel="noreferrer" className="info-box link-hover">
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </span>
            <div>
              <h5>Alamat</h5>
              <p>Jl. Cipinang Pulo No.19, RT.7/RW.14, Cipinang Besar Utara, Kecamatan Jatinegara, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13410</p>
            </div>
          </a>

          {/* 2. E-MAIL (Langsung buka aplikasi email) */}
          <a href="mailto:smkn46jakarta@gmail.com" className="info-box link-hover">
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </span>
            <div>
              <h5>E-Mail</h5>
              <p>smkn46jakarta@gmail.com</p>
            </div>
          </a>

          {/* 3. KONTAK (Langsung buka dialer/telepon HP) */}
          <a href="tel:0218195127" className="info-box link-hover">
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </span>
            <div>
              <h5>Kontak</h5>
              <p>(021) 8195127</p>
            </div>
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-purple-line"></div>
        <p>Copyright by AtasAtap</p>
      </div>
    </footer>
  );
};

export default Footer;