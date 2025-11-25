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
      {/* 파란 반투명 판 (CSS에서 쓰면 주석 풀면 됨) */}
      <div className="hero-overlay" />

      <div className="hero-inner">
        {/* 왼쪽 텍스트 영역 */}
        <div className="hero-left">
          <p className="hero-tagline">자연의학, 미래 100년의 의학을 열다,</p>
          <h1 className="hero-title">
            이제는 새로운 의학의 중심입니다.
            <br />
            <span>ICoCM이 그 길을 엽니다.</span>
          </h1>
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
