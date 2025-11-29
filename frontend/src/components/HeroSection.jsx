// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import "./HeroSection.css";

import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const slides = [slide1, slide2, slide3];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // 간단 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* 필요하면 다시 쓸 수 있게만 남겨둠 */}
      {/* <div className="hero-overlay" /> */}

      <div className="hero-inner">
        {/* 왼쪽 텍스트 영역 */}
        <div className="hero-left">
          <p className="hero-tagline">자연의학, 미래 100년의 의학을 열다,</p>

          {/* 🔥 h1에 학회 이름 박아서 검색용 키워드 */}
          <h1 className="hero-title">(사)국제융합의학학회</h1>

          <p className="hero-subtitle">
            대체의학·통합의학 연구와 
            <br />
            국제 학술 교류를 선도하는 공식 학회입니다.
            <br />
            <span>ICoCM이 그 길을 엽니다.</span>
          </p>
        </div>

        {/* 오른쪽 슬라이드 영역 */}
        <div className="hero-right">
          <div className="hero-slide-wrapper">
            <img src={slides[current]} alt={`slide-${current + 1}`} />
          </div>

          <div className="hero-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-dot ${idx === current ? "active" : ""}`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
