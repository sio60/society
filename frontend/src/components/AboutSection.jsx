import React from "react";
import "./AboutSection.css";
import aboutMainImg from "../assets/about-main.jpg";

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <div className="about-inner">
        {/* 왼쪽 텍스트 영역 */}
        <div className="about-left">
          <p className="about-eyebrow">학회 소개</p>
          <h2 className="about-title">국제융합의학학회는 이런 곳입니다</h2>

          <p className="about-desc">
            (사)국제융합의학학회는 자연의학·대체의학·현대의학을 아우르며
            과학적 근거에 기반한 통합의학 연구와 교육을 수행하는 학술 단체입니다.
            일상에서 실천 가능한 자연치유와 예방의학을 통해
            보다 건강한 삶을 함께 만들어 가고자 합니다.
          </p>

          <ul className="about-list">
            <li>
              <strong>자연의학 교육 및 연구</strong>
              <p>
                체계적인 교육과 연구를 통해 자연치유와 대체의학의 가능성을
                탐구합니다.
              </p>
            </li>
            <li>
              <strong>통합의학 학술 교류</strong>
              <p>
                다양한 직역의 전문가들이 지식과 경험을 나누는 학술 네트워크를
                운영합니다.
              </p>
            </li>
            <li>
              <strong>대체의학 정보 공유</strong>
              <p>
                검증된 자연의학·대체의학 정보를 회원과 대중에게 알기 쉽게
                전달합니다.
              </p>
            </li>
          </ul>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div className="about-right">
          <div className="about-image-wrapper">
            <img
              src={aboutMainImg}
              alt="국제융합의학학회 자연치유 프로그램 현장 모습"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
