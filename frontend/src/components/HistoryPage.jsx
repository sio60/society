import React from "react";
import "./HistoryPage.css";
import foundingImg from "../assets/founding-statement.png"; // 설립취지서 이미지

export default function HistoryPage() {
  return (
    <main className="history-page">
      <section className="history-page-inner">
        <header className="history-page-header">
          <h1>학회 연혁 & 설립 취지</h1>
          <p className="history-page-tagline">
            자연의학, 미래 100년의 의학을 열다
          </p>
          <p className="history-page-lead">
            국제융합의학학회(ICoCM)는 자연의학과 현대의학의 조화를 이루는
            통합의학을 목표로 꾸준히 활동을 이어오고 있습니다.
          </p>
        </header>

        <section className="history-page-text">
          <p>
            2014년 국제통합의학학회로 출발하여 법인과 교육분야 특허를
            (사)국제융합의학학회로 등록하였습니다. 2020년
            &lsquo;자연의학(Natural Medicine)&rsquo;을 학회의 정체성으로
            확립하며 서양의학과 동양의학, 그리고 자연 치유 원리를 통합하는
            미래형 치유 패러다임을 제시해 왔습니다.
          </p>
          <p>
            우리는 자연치유력과 항상성을 기반으로 과학적 자연의학을 연구하고
            검증하며, 교육·임상·치유 프로그램을 통해 국민 건강 증진에
            앞장서고 있습니다.
          </p>
          <p className="history-page-quote">
            자연의학, 이제는 새로운 의학의 중심입니다.
            <br />
            ICoCM이 그 길을 엽니다.
          </p>
        </section>

        <section className="history-page-image-block">
          <h2>학회 설립 취지서</h2>
          <p className="history-page-image-desc">
            학회의 설립 배경과 목표가 담긴 설립 취지서 원문입니다.
          </p>
          <div className="history-page-image-wrapper">
            <img src={foundingImg} alt="국제융합의학학회 설립 취지서" />
          </div>
        </section>
      </section>
    </main>
  );
}
