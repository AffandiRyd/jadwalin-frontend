import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Hero = () => {
  return (
    <div className="hero-container">
      {/* VIDEO BACKGROUND (Pastikan file sekolah.mp4 ada di folder public) */}
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="/sekolah.mp4" type="video/mp4" />
        Browser kamu tidak mendukung video.
      </video>

      <div className="overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">
          All of Forensix,<br />
          All in one<span className="blue-dot-big">.</span>
        </h1>
        <p className="hero-subtitle">
          View school schedules and agendas with just one touch. #MakeItEasier
        </p>
        
        {/* Tombol Learn More yang pindah ke halaman Tentang Kami */}
        <Link to="/tentang-kami" className="btn-outline" style={{ display: 'inline-block' }}>
          Learn More Here
        </Link>
      </div>
    </div>
  );
};

export default Hero;