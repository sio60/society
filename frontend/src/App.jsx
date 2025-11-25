// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import HistorySection from "./components/HistorySection";
import HistoryPage from "./components/HistoryPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";

// 메인 홈 화면(헤더/푸터 제외한 본문만)
function HomePage() {
  return (
    <>
      <HeroSection />
      <HistorySection />
      <AboutSection />
      <ProgramsSection />
    </>
  );
}

// 라우트 + 푸터 조건 렌더링
function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  // ✅ 로그인, 회원가입 페이지에서는 푸터 숨기기
  const isAuthPage = path === "/login" || path === "/signup";

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* ✅ 로그인/회원가입이 아닐 때만 푸터 표시 */}
      {!isAuthPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
