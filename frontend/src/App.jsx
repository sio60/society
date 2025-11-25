// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import HistorySection from "./components/HistorySection";
import HistoryPage from "./components/HistoryPage";
import Footer from "./components/Footer";

import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";

function HomePage() {
  return (
    <>
      <HeroSection />
      <HistorySection />
      <AboutSection />
      <ProgramsSection />
      {/* ⛔ 여기 있던 Footer는 제거 */}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      {/* ✅ 모든 페이지 공통 푸터 */}
      <Footer />
    </BrowserRouter>
  );
}
