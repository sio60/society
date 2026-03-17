// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HistorySection from "./components/HistorySection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import HistoryPage from "./components/HistoryPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import NoticePage from "./components/NoticePage";
import NoticeDetailPage from "./components/NoticeDetailPage";
import AdminPage from "./components/AdminPage";
import LatestNewsTicker from "./components/LatestNewsTicker";

// 🔹 새 공통 프로그램 페이지
import ProgramPage from "./components/ProgramPage";

// 🔹 개별 코너 페이지들
import DamyangBranchPage from "./components/DamyangBranchPage";
import KoreanGlobalizationPage from "./components/KoreanGlobalizationPage";
import PrivateLicensePage from "./components/PrivateLicensePage";
import OneDayClassPage from "./components/OneDayClassPage";
import WalkingMeditationPage from "./components/WalkingMeditationPage";
import DamyangHealthJournalPage from "./components/DamyangHealthJournalPage";

// 메인 화면 + 푸터
function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestNewsTicker />
      <HistorySection />
      <AboutSection />
      <ProgramsSection />
      <Footer />
    </>
  );
}

// 연혁/설립취지 + 푸터
function HistoryWithFooter() {
  return (
    <>
      <HistoryPage />
      <Footer />
    </>
  );
}

// 공지 목록 + 푸터
function NoticeWithFooter() {
  return (
    <>
      <NoticePage />
      <Footer />
    </>
  );
}

// 공지 상세 + 푸터
function NoticeDetailWithFooter() {
  return (
    <>
      <NoticeDetailPage />
      <Footer />
    </>
  );
}

// 🔹 담양군 지부 + 푸터
function DamyangBranchWithFooter() {
  return (
    <>
      <DamyangBranchPage />
      <Footer />
    </>
  );
}

// 🔹 한국어의 세계화 사업 + 푸터
function KoreanGlobalizationWithFooter() {
  return (
    <>
      <KoreanGlobalizationPage />
      <Footer />
    </>
  );
}

// 🔹 민간자격 과정 + 푸터
function PrivateLicenseWithFooter() {
  return (
    <>
      <PrivateLicensePage />
      <Footer />
    </>
  );
}

// 🔹 One-day Class + 푸터
function OneDayClassWithFooter() {
  return (
    <>
      <OneDayClassPage />
      <Footer />
    </>
  );
}

// 🔹 걷기명상 + 푸터
function WalkingMeditationWithFooter() {
  return (
    <>
      <WalkingMeditationPage />
      <Footer />
    </>
  );
}

// 🔹 담양 건강증진 일지 + 푸터
function DamyangHealthJournalWithFooter() {
  return (
    <>
      <DamyangHealthJournalPage />
      <Footer />
    </>
  );
}

// 🔹 공통 프로그램 페이지 + 푸터 (/program/:slug)
function ProgramWithFooter() {
  return (
    <>
      <ProgramPage />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryWithFooter />} />

        {/* 공지 목록 / 상세 */}
        <Route path="/notice" element={<NoticeWithFooter />} />
        <Route path="/notice/:noticeId" element={<NoticeDetailWithFooter />} />

        {/* 🔹 기존 고정 코너 라우트 (예전 링크 호환용) */}
        <Route path="/damyang-branch" element={<DamyangBranchWithFooter />} />
        <Route
          path="/korean-globalization"
          element={<KoreanGlobalizationWithFooter />}
        />
        <Route
          path="/private-license"
          element={<PrivateLicenseWithFooter />}
        />
        <Route path="/one-day-class" element={<OneDayClassWithFooter />} />
        <Route
          path="/walking-meditation"
          element={<WalkingMeditationWithFooter />}
        />
        <Route
          path="/damyang-health-journal"
          element={<DamyangHealthJournalWithFooter />}
        />

        {/* 🔹 새 공통 프로그램 라우트 (Header에서 /program/:slug 로 이동) */}
        <Route path="/program/:slug" element={<ProgramWithFooter />} />

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminPage />} />

        {/* 로그인/회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}
