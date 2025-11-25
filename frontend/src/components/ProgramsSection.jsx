import React from "react";
import "./ProgramsSection.css";
import programEdu from "../assets/about-classroom.jpg";
import programConcert from "../assets/about-concert.jpg";

export default function ProgramsSection() {
  return (
    <section id="programs" className="programs">
      <div className="programs-inner">
        <h2 className="programs-title">국제융합의학학회의 주요 활동</h2>
        <p className="programs-subtitle">
          학회는 자연의학과 현대의학을 아우르는 다양한 교육·연구·문화 프로그램을
          운영합니다.
        </p>

        <div className="programs-grid">
          {/* 카드 1 – 자연의학 교육/연구 */}
          <article className="program-card">
            <div className="program-image">
              <img
                src={programEdu}
                alt="국제융합의학학회 자연의학 교육 프로그램 현장"
              />
            </div>
            <h3 className="program-card-title">자연의학 교육·연구 프로그램</h3>
            <p className="program-card-text">
              자연치유, 대체의학, 생활 속 건강관리 등을 주제로 한 강의와
              소규모 모임을 통해 체계적인 교육과 연구를 진행합니다.
            </p>
          </article>

          {/* 카드 2 – 힐링 콘서트/문화행사 */}
          <article className="program-card">
            <div className="program-image">
              <img
                src={programConcert}
                alt="힐링 콘서트 및 문화행사 무대 모습"
              />
            </div>
            <h3 className="program-card-title">힐링 콘서트 & 문화행사</h3>
            <p className="program-card-text">
              음악·공연·예술을 결합한 힐링 프로그램과 학술행사를 통해
              몸과 마음의 치유를 함께 경험할 수 있는 자리를 마련합니다.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
