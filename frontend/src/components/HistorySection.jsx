// src/components/HistorySection.jsx
import React from "react";
import "./HistorySection.css";

export default function HistorySection() {
  return (
    <section className="history">
      <div className="history-inner">
        <h2 className="history-title">학회 연혁</h2>
        <p className="history-tagline">— 자연의학, 미래 100년의 의학을 열다 —</p>

        <p className="history-text">
          2014년 국제통합의학학회로 출발하여 법인과 교육분야 특허를
          (사)국제융합의학학회로 등록하였습니다. 2020년
          &lsquo;자연의학(Natural Medicine)&rsquo;을 학회의 정체성으로 확립하며
          서양의학과 동양의학, 그리고 자연 치유 원리를 통합하는 미래형 치유
          패러다임을 제시해 왔습니다.
        </p>
        <p className="history-text">
          우리는 자연치유력과 항상성을 기반으로 과학적 자연의학을 연구하고
          검증하며, 교육·임상·치유 프로그램을 통해 국민 건강 증진에
          앞장서고 있습니다.
        </p>
        <p className="history-highlight">
          자연의학, 이제는 새로운 의학의 중심입니다.
          <br />
          ICoCM이 그 길을 엽니다.
        </p>
      </div>
    </section>
  );
}
