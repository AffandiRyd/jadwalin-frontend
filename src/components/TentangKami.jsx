import React from 'react';
import Footer from '../components/Footer';

const TentangKami = () => {
  return (
    // Gunakan React Fragment (tag kosong) untuk membungkus semuanya
    <>
      <div className="tentang-page">
        {/* --- BACKGROUND VIDEO SAMA KAYAK HERO --- */}
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/sekolah.mp4" type="video/mp4" />
          Browser kamu tidak mendukung video.
        </video>
        
        {/* Efek gelap transparan agar teks tetap terbaca */}
        <div className="overlay"></div>

        {/* --- KONTEN UTAMA --- */}
        <div className="tentang-container">
          <h2 className="tentang-title">Tentang Jadwal!n</h2>
          <p className="tentang-desc">
            Jadwal!n hadir sebagai solusi digital untuk menjembatani koordinasi antar warga sekolah. 
            Kami percaya bahwa manajemen waktu yang baik adalah kunci keberhasilan belajar-mengajar. 
            Dengan platform ini, kami berkomitmen memudahkan siswa, tenaga pengajar, staf tata usaha, 
            hingga kepala sekolah untuk mengatur agenda, memantau event, dan memastikan setiap momen berharga 
            di sekolah berjalan dengan terorganisir dan efisien.
          </p>

          <div className="tentang-cards">
            {/* Card 1 */}
            <div className="t-card">
              <div className="t-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Mudah</h3>
              <p><strong>Koordinasi Digital yang Mudah.</strong><br/>Menjadi jembatan komunikasi yang menghubungkan siswa, guru, hingga kepala sekolah dalam satu platform untuk penyelarasan agenda tanpa hambatan.</p>
            </div>

            {/* Card 2 */}
            <div className="t-card">
              <div className="t-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3>Praktis</h3>
              <p><strong>Manajemen Waktu yang Efisien.</strong><br/>Mengoptimalkan keberhasilan belajar-mengajar melalui pengaturan jadwal terorganisir yang mencegah bentrok agenda sekolah.</p>
            </div>

            {/* Card 3 */}
            <div className="t-card">
              <div className="t-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <h3>Efisien</h3>
              <p><strong>Pantau Event secara Praktis.</strong><br/>Akses real-time untuk memantau dan mengatur setiap momen berharga serta event sekolah, kapan saja dan di mana saja dalam satu genggaman.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* TARUH FOOTER DI SINI (Di luar "tentang-page") */}
      <Footer />
    </>
  );
};

export default TentangKami;